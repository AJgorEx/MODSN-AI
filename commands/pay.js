const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer coins to another user')
    .addUserOption(o =>
      o.setName('user').setDescription('Recipient').setRequired(true))
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount to send').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    if (target.bot) return interaction.reply({ content: 'Cannot pay bots.', ephemeral: true });
    try {
      interaction.client.economy.transfer(interaction.user.id, target.id, amount);
      await interaction.reply(`Sent ${amount} coins to ${target.tag}`);
    } catch (e) {
      await interaction.reply({ content: 'Transaction failed: ' + e.message, ephemeral: true });
    }
  }
};
