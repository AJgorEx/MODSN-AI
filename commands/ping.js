module.exports = {
  name: 'ping',
  description: 'Sprawdź czy bot działa',
  execute(message) {
    message.reply('Pong!');
  }
};
