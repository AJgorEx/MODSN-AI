module.exports = {
  name: 'help',
  description: 'Wyświetla listę komend',
  execute(message) {
    const commands = message.client.commands.map(cmd => `**!${cmd.name}** - ${cmd.description}`).join('\n');
    message.channel.send(`Dostępne komendy:\n${commands}`);
  }
};
