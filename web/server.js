const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
// `fetch` is available globally in recent Node versions
// no additional import is required

module.exports = function startWebServer(client) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Cookie parser MUST come before the session middleware
  app.use(cookieParser(process.env.SESSION_SECRET));
  const csp = helmet.contentSecurityPolicy.getDefaultDirectives();
  csp["script-src"].push("'unsafe-inline'");
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
    // Debug information to help verify session state persistence
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
    res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
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
      const token = await tokenRes.json();
      if (!token.access_token) return res.status(401).send('Auth failed');
      req.session.accessToken = token.access_token;
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      req.session.user = await userRes.json();
      res.redirect('/servers.html');
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

  app.get('/guilds', requireAuth, async (req, res) => {
    try {
      const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.session.accessToken}` }
      });
      const guilds = await guildRes.json();
      const botGuilds = client.guilds.cache;
      const filtered = guilds.filter(g => botGuilds.has(g.id));
      res.json(filtered);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch guilds');
    }
  });

  app.get('/channels/:guildId', requireAuth, async (req, res) => {
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

  app.post('/message', requireAuth, async (req, res) => {
    const { channelId, message } = req.body;
    const channel = client.channels.cache.get(channelId);
    if (!channel) return res.status(400).send('Channel not found');
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

  app.listen(PORT, () =>
    console.log(`\uD83D\uDD0C Web management listening on port ${PORT}`)
  );
};
