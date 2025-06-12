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
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Deposited ${amount} coins to your bank.` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Deposit failed: ' + e.message });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
