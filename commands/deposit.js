const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit coins into your bank')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    try {
      interaction.client.economy.deposit(interaction.user.id, amount);
      await interaction.reply(`Deposited ${amount} coins to your bank.`);
    } catch (e) {
      await interaction.reply({ content: 'Deposit failed: ' + e.message, ephemeral: true });
    }
  }
};
