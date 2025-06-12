module.exports = {
  name: '8ball',
  description: 'Odpowiada na pytania tak/nie',
  execute(message, args) {
    if (!args.length) {
      return message.reply('Zadaj pytanie.');
    }
    const responses = [
      'Tak',
      'Nie',
      'Może',
      'Z pewnością',
      'Wątpię',
      'Oczywiście',
      'Nie chcesz wiedzieć'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(response);
  }
};
