const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('siema')
    .setDescription('Przywitaj się z botem'),
  async execute(interaction) {
    const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Siemano, co tam wariacie?' });
    await interaction.reply({ embeds: [embed] });
  }
};
