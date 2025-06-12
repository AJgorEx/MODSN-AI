const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const fs = require('fs');
// `fetch` is available globally in recent Node versions
// no additional import is required

module.exports = function startWebServer(client) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  const configPath = path.join(__dirname, '../commands-config.json');

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Cookie parser MUST come before the session middleware
  app.use(cookieParser(process.env.SESSION_SECRET));
  const csp = helmet.contentSecurityPolicy.getDefaultDirectives();
  csp["script-src"].push("'unsafe-inline'", 'https://cdn.jsdelivr.net');
  csp["img-src"].push('https://cdn.discordapp.com');
  app.use(
    helmet({
      contentSecurityPolicy: { directives: csp }
    })
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
      }
    })
  );
  const staticPath = path.join(__dirname);

  function sendProtected(file) {
    return (req, res) => {
      res.set('Cache-Control', 'no-store');
      res.sendFile(path.join(staticPath, file));
    };
  }

  app.get('/servers.html', requireAuth, sendProtected('servers.html'));
  app.get('/admin.html', requireAuth, sendProtected('admin.html'));
  app.get('/user.html', requireAuth, sendProtected('user.html'));
  app.get('/commands.html', requireAuth, sendProtected('commands.html'));
  app.get('/role-manager.html', requireAuth, sendProtected('role-manager.html'));
  app.get('/economy-admin.html', requireAuth, sendProtected('economy-admin.html'));

  app.use(express.static(staticPath));

  app.get('/invite', (req, res) => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      permissions: '8',
      scope: 'identify guilds bot'
    });
    res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
  });

  app.get('/login', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;
    console.log('[LOGIN]', {
      sessionId: req.session.id,
      oauthState: req.session.oauthState
    });
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'identify guilds',
      state
    });
    req.session.save(() => {
      res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
    });
  });

  app.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    console.log('[CALLBACK]', {
      sessionId: req.session.id,
      savedState: req.session.oauthState,
      returnedState: state
    });
    if (!code || state !== req.session.oauthState) {
      return res.status(400).send('Invalid state');
    }
    delete req.session.oauthState;
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      });
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      let token;
      try {
        const ct = tokenRes.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const text = await tokenRes.text();
          throw new Error(`Invalid response: ${text}`);
        }
        token = await tokenRes.json();
      } catch (err) {
        console.error('Failed to fetch token', err);
        return res.status(500).send('OAuth failed');
      }
      if (!token.access_token) return res.status(401).send('Auth failed');
      req.session.accessToken = token.access_token;
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      req.session.user = await userRes.json();
      req.session.save(() => {
        res.redirect('/servers.html');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('OAuth failed');
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
  });

  function requireAuth(req, res, next) {
    if (!req.session.accessToken) return res.status(401).send('Unauthorized');
    next();
  }

  async function fetchUserGuilds(req) {
    if (!req.session.guilds) {
      const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.session.accessToken}` }
      });
      if (!guildRes.ok) throw new Error('Failed to fetch guilds');
      const guilds = await guildRes.json();
      const botGuilds = client.guilds.cache;
      req.session.guilds = guilds.filter(g => botGuilds.has(g.id));
    }
    return req.session.guilds;
  }

  async function verifyGuildAccess(req, res, next) {
    try {
      const guilds = await fetchUserGuilds(req);
      if (!guilds.find(g => g.id === req.params.guildId)) {
        return res.status(403).send('Forbidden');
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to verify guild');
    }
  }

  async function getUserId(req) {
    if (!req.session.user) {
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${req.session.accessToken}` }
      });
      if (!userRes.ok) throw new Error('Failed to fetch user');
      req.session.user = await userRes.json();
    }
    return req.session.user.id;
  }

  app.get('/me', requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        const userRes = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${req.session.accessToken}` }
        });
        if (!userRes.ok) throw new Error('Failed to fetch user');
        req.session.user = await userRes.json();
      }
      res.json(req.session.user || {});
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch user');
    }
  });

  app.get('/stats', requireAuth, (req, res) => {
    res.json({ botGuilds: client.guilds.cache.size });
  });

  app.get('/command-status/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    const result = {};
    client.commands.forEach((_, name) => {
      result[name] = client.isCommandEnabled(guildId, name);
    });
    res.json(result);
  });

  app.post('/command-status/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    const { command, enabled } = req.body;
    if (!client.commands.has(command)) {
      return res.status(400).send('Invalid command');
    }
    if (!client.commandStatus.guilds[guildId]) client.commandStatus.guilds[guildId] = {};
    client.commandStatus.guilds[guildId][command] = !!enabled;
    client.saveCommandStatus();
    res.send('OK');
  });

  app.get('/settings/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    res.json(client.guildSettings.get(guildId));
  });

  app.post('/settings/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    const { color } = req.body;
    if (typeof color !== 'string' || !/^#?[0-9a-fA-F]{6}$/.test(color)) {
      return res.status(400).send('Invalid color');
    }
    client.setEmbedColor(guildId, color.startsWith('#') ? color : '#' + color);
    res.send('OK');
  });

  app.get('/welcome-settings/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    const set = client.guildSettings.get(guildId);
    res.json({
      channel: set.welcomeChannel || '',
      message: set.welcomeMessage || ''
    });
  });

  app.post('/welcome-settings/:guildId', requireAuth, verifyGuildAccess, (req, res) => {
    const guildId = req.params.guildId;
    const { channel, message } = req.body;
    if (typeof channel !== 'string' || typeof message !== 'string') {
      return res.status(400).send('Invalid payload');
    }
    client.guildSettings.set(guildId, { welcomeChannel: channel, welcomeMessage: message });
    res.send('OK');
  });

  app.get('/guilds', requireAuth, async (req, res) => {
    try {
      const guilds = await fetchUserGuilds(req);
      res.json(guilds);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch guilds');
    }
  });

  app.get('/channels/:guildId', requireAuth, verifyGuildAccess, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(404).send('Guild not found');
    try {
      const channels = (await guild.channels.fetch())
        .filter(ch => ch.isTextBased())
        .map(ch => ({ id: ch.id, name: ch.name }));
      res.json(channels);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch channels');
    }
  });

  app.get('/emojis/:guildId', requireAuth, verifyGuildAccess, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(404).send('Guild not found');
    try {
      const emojis = (await guild.emojis.fetch()).map(e => ({
        id: e.id,
        name: e.name,
        animated: e.animated,
        url: e.url
      }));
      res.json(emojis);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch emojis');
    }
  });

  app.post('/message', requireAuth, async (req, res) => {
    const { channelId, message } = req.body;
    const channel = client.channels.cache.get(channelId);
    if (!channel) return res.status(400).send('Channel not found');
    try {
      const guilds = await fetchUserGuilds(req);
      if (!guilds.find(g => g.id === channel.guildId)) {
        return res.status(403).send('Forbidden');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to verify guild');
    }
    if (typeof message !== 'string' || message.length === 0 || message.length > 2000) {
      return res.status(400).send('Invalid message');
    }
    try {
      await channel.send(message);
      res.send('Message sent');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to send message');
    }
  });

  app.post('/embed', requireAuth, async (req, res) => {
    const { channelId, embed } = req.body;
    const channel = client.channels.cache.get(channelId);
    if (!channel) return res.status(400).send('Channel not found');
    try {
      const guilds = await fetchUserGuilds(req);
      if (!guilds.find(g => g.id === channel.guildId)) {
        return res.status(403).send('Forbidden');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to verify guild');
    }
    if (!embed || typeof embed !== 'object') {
      return res.status(400).send('Invalid embed');
    }
    try {
      await channel.send({ embeds: [embed] });
      res.send('Embed sent');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to send embed');
    }
  });

  app.get('/roles/:guildId', requireAuth, verifyGuildAccess, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(404).send('Guild not found');
    try {
      const roles = (await guild.roles.fetch()).map(r => ({ id: r.id, name: r.name }));
      res.json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch roles');
    }
  });

  app.post('/member-role/:guildId', requireAuth, verifyGuildAccess, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(404).send('Guild not found');
    const { memberId, roleId, action } = req.body;
    if (!memberId || !roleId || !['add', 'remove'].includes(action)) {
      return res.status(400).send('Invalid payload');
    }
    try {
      const member = await guild.members.fetch(memberId);
      if (!member) return res.status(404).send('Member not found');
      if (action === 'add') {
        await member.roles.add(roleId);
      } else {
        await member.roles.remove(roleId);
      }
      res.send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to modify role');
    }
  });

  app.get('/members/:guildId', requireAuth, verifyGuildAccess, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(404).send('Guild not found');
    try {
      const members = (await guild.members.fetch({ limit: 100 })).map(m => ({
        id: m.id,
        username: m.user.username,
        avatar: m.user.displayAvatarURL({ size: 64 })
      }));
      res.json(members);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch members');
    }
  });

  app.get('/economy', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch economy');
    }
  });

  app.post('/economy/deposit', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      const amt = parseInt(req.body.amount, 10);
      client.economy.deposit(id, amt);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.post('/economy/withdraw', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      const amt = parseInt(req.body.amount, 10);
      client.economy.withdraw(id, amt);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.post('/economy/daily', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      client.economy.daily(id);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.post('/economy/work', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      const reward = client.economy.work(id);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank, reward });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.post('/economy/gamble', requireAuth, async (req, res) => {
    try {
      const id = await getUserId(req);
      const amt = parseInt(req.body.amount, 10);
      const reward = client.economy.gamble(id, amt);
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank, reward });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.get('/economy/user/:guildId/:userId', requireAuth, verifyGuildAccess, (req, res) => {
    try {
      const user = client.economy.getUser(req.params.userId);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(400).send('Failed to fetch user economy');
    }
  });

  app.post('/economy/user/:guildId/:userId', requireAuth, verifyGuildAccess, (req, res) => {
    try {
      const { action, amount } = req.body;
      const id = req.params.userId;
      const amt = parseInt(amount, 10) || 0;
      switch (action) {
        case 'addWallet':
          client.economy.addBalance(id, amt, 'admin');
          break;
        case 'addBank':
          client.economy.addBank(id, amt);
          break;
        case 'setWallet':
          client.economy.setBalance(id, amt);
          break;
        case 'setBank':
          client.economy.setBank(id, amt);
          break;
        case 'resetCooldowns':
          client.economy.resetCooldowns(id);
          break;
        default:
          return res.status(400).send('Invalid action');
      }
      const user = client.economy.getUser(id);
      res.json({ balance: user.balance, bank: user.bank });
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  app.listen(PORT, () =>
    console.log(`\uD83D\uDD0C Web management listening on port ${PORT}`)
  );
};
