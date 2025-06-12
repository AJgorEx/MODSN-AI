const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Definicja angielskiego słowa')
    .addStringOption(o =>
      o.setName('word').setDescription('Słowo').setRequired(true)),
  async execute(interaction) {
    const word = interaction.options.getString('word');
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const data = await res.json();
      const meaning = data[0].meanings[0].definitions[0].definition;
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `${word}: ${meaning}` });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się znaleźć definicji.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
