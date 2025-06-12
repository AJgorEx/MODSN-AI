const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Losowe zdjęcie psa'),
  async execute(interaction) {
    try {
      const res = await fetch('https://random.dog/woof.json');
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, { image: { url: data.url } });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać psa.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
