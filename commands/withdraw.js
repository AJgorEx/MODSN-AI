const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw coins from your bank')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    try {
      interaction.client.economy.withdraw(interaction.user.id, amount);
      await interaction.reply(`Withdrew ${amount} coins from your bank.`);
    } catch (e) {
      await interaction.reply({ content: 'Withdraw failed: ' + e.message, ephemeral: true });
    }
  }
};
