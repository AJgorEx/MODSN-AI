const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work for some coins'),
  async execute(interaction) {
    try {
      const reward = interaction.client.economy.work(interaction.user.id);
      await interaction.reply(`You earned ${reward} coins from work!`);
    } catch (e) {
      await interaction.reply({ content: 'You have to wait before working again.', ephemeral: true });
    }
  }
};
