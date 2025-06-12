const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Tłumaczy tekst na wybrany język')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    )
    .addStringOption(o =>
      o.setName('text').setDescription('Tekst do przetłumaczenia').setRequired(true))
    .addStringOption(o =>
      o.setName('lang').setDescription('Kod języka docelowego').setRequired(true))
    .addStringOption(o =>
      o.setName('source').setDescription('Kod języka źródłowego').setRequired(false)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const lang = interaction.options.getString('lang');
    const source = interaction.options.getString('source') || 'auto';
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source, target: lang })
      });
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: data.translatedText });
      await interaction.reply({ embeds: [embed], ephemeral });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Tłumaczenie nie powiodło się.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
