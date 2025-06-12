const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Shows member count'),
  async execute(interaction) {
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Member count: ${interaction.guild.memberCount}` });
    await interaction.reply({ embeds: [embed] });
  }
};
