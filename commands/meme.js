const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Wysyła losowego mema'),
  async execute(interaction) {
    try {
      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, {
        title: data.title,
        image: { url: data.url }
      });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać mema.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
