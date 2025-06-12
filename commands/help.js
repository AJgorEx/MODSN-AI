const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Wyświetla listę komend'),
  async execute(interaction) {
    const commands = interaction.client.commands
      .map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`)
      .join('\n');
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Dostępne komendy:\n${commands}` });
    await interaction.reply({ embeds: [embed] });
  }
};
