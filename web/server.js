const express = require('express');
const path = require('path');

module.exports = function startWebServer(client) {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname)));

  app.post('/message', async (req, res) => {
    if (!ADMIN_TOKEN || req.body.token !== ADMIN_TOKEN) {
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
