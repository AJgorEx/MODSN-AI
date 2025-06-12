const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server'),
  async execute(interaction) {
    const { guild } = interaction;
    await interaction.reply(`Server name: ${guild.name}\nMembers: ${guild.memberCount}`);
  }
};
