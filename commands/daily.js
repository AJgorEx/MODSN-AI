const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction) {
    try {
      interaction.client.economy.daily(interaction.user.id);
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'You claimed your daily 100 coins!' });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Daily already claimed.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
