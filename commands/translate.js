const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Tłumaczy tekst na wybrany język')
    .addStringOption(o =>
      o.setName('text').setDescription('Tekst do przetłumaczenia').setRequired(true))
    .addStringOption(o =>
      o.setName('lang').setDescription('Kod języka docelowego').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const lang = interaction.options.getString('lang');
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'auto', target: lang })
      });
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: data.translatedText });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Tłumaczenie nie powiodło się.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
