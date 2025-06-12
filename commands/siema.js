const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('siema')
    .setDescription('Przywitaj się z botem'),
  async execute(interaction) {
    await interaction.reply('Siemano, co tam wariacie?');
  }
};
