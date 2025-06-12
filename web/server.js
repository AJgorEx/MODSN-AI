const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

module.exports = function startWebServer(client) {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const USER_TOKEN = process.env.USER_TOKEN;

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname)));

  app.post('/login', (req, res) => {
    const token = req.body.token;
    if (ADMIN_TOKEN && token === ADMIN_TOKEN) {
      res.cookie('role', 'admin', { httpOnly: true });
      return res.redirect('/admin.html');
    }
    if (USER_TOKEN && token === USER_TOKEN) {
      res.cookie('role', 'user', { httpOnly: true });
      return res.redirect('/user.html');
    }
    res.status(401).send('Invalid token');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('role');
    res.redirect('/');
  });

  app.post('/message', async (req, res) => {
    if (req.cookies.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    const channelId = req.body.channelId;
    const message = req.body.message;
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      return res.status(400).send('Channel not found');
    }
    try {
      await channel.send(message);
      res.send('Message sent');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to send message');
    }
  });

  app.listen(PORT, () => console.log(`\uD83D\uDD0C Web management listening on port ${PORT}`));
};
