const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crypto')
    .setDescription('Sprawdza cenę kryptowaluty')
    .addStringOption(o =>
      o.setName('id').setDescription('Nazwa (id) kryptowaluty, np. bitcoin').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`);
      const data = await res.json();
      if (!data[id] || !data[id].usd) throw new Error('Brak danych');
      const price = data[id].usd;
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Cena ${id}: $${price}` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać ceny.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
