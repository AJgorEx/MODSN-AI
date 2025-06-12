const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction) {
    try {
      interaction.client.economy.daily(interaction.user.id);
      await interaction.reply('You claimed your daily 100 coins!');
    } catch (e) {
      await interaction.reply({ content: 'Daily already claimed.', ephemeral: true });
    }
  }
};
