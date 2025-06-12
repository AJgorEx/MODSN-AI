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
    if (target.bot) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Cannot pay bots.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    try {
      interaction.client.economy.transfer(interaction.user.id, target.id, amount);
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Sent ${amount} coins to ${target.tag}` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Transaction failed: ' + e.message });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
