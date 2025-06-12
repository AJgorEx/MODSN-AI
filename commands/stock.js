const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Sprawdza cenę akcji')
    .addStringOption(o =>
      o.setName('symbol').setDescription('Symbol akcji').setRequired(true)),
  async execute(interaction) {
    const symbol = interaction.options.getString('symbol');
    try {
      const url = `https://stooq.pl/q/l/?s=${encodeURIComponent(symbol)}.us&f=sd2ohlcv&h&e=csv`;
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.trim().split('\n');
      if (lines.length < 2) throw new Error('Brak danych');
      const parts = lines[1].split(',');
      const price = parts[5];
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Cena ${symbol.toUpperCase()}: ${price}` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać ceny akcji.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
