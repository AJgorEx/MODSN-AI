const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdź czy bot działa'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  }
};
