module.exports = {
  name: 'poll',
  description: 'Tworzy prostą ankietę z reakcjami 👍 i 👎',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Podaj treść ankiety.');
    }
    const question = args.join(' ');
    const pollMessage = await message.channel.send(`\uD83D\uDCCA **${question}**`);
    await pollMessage.react('👍');
    await pollMessage.react('👎');
  }
};
