const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Wyświetla listę komend'),
  async execute(interaction) {
    const commands = interaction.client.commands
      .map(cmd => {
        const count = interaction.client.getCommandUsage(cmd.data.name);
        return `**/${cmd.data.name}** - ${cmd.data.description} (użyto ${count}x)`;
      })
      .join('\n');
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Dostępne komendy:\n${commands}` });
    await interaction.reply({ embeds: [embed] });
  }
};
