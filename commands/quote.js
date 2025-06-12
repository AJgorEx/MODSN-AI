const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Losowy cytat'),
  async execute(interaction) {
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `${data.content} — ${data.author}` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać cytatu.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
