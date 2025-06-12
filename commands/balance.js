const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Shows your wallet and bank balance'),
  async execute(interaction) {
    const user = interaction.client.economy.getUser(interaction.user.id);
    await interaction.reply(`Wallet: ${user.balance} coins | Bank: ${user.bank} coins`);
  }
};
