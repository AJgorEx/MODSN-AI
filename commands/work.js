const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work for some coins'),
  async execute(interaction) {
    try {
      const reward = interaction.client.economy.work(interaction.user.id);
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `You earned ${reward} coins from work!` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'You have to wait before working again.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
