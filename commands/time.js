const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Aktualny czas UTC'),
  async execute(interaction) {
    try {
      const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
      const data = await res.json();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: data.datetime });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać czasu.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
