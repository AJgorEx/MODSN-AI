const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Shows member count'),
  async execute(interaction) {
    await interaction.reply(`Member count: ${interaction.guild.memberCount}`);
  }
};
