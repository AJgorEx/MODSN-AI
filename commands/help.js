const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Wyświetla listę komend'),
  async execute(interaction) {
    const commands = interaction.client.commands
      .map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`)
      .join('\n');
    await interaction.reply(`Dostępne komendy:\n${commands}`);
  }
};
