const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Shows your wallet and bank balance'),
  async execute(interaction) {
    const user = interaction.client.economy.getUser(interaction.user.id);
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: 'Your Balance',
      fields: [
        { name: 'Wallet', value: `${user.balance} coins`, inline: true },
        { name: 'Bank', value: `${user.bank} coins`, inline: true }
      ]
    });
    await interaction.reply({ embeds: [embed] });
  }
};
