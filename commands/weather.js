const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Wyświetla aktualną pogodę dla wybranego miasta')
    .addStringOption(o =>
      o.setName('city').setDescription('Nazwa miasta').setRequired(true)),
  async execute(interaction) {
    const city = interaction.options.getString('city');
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const data = await response.json();
      const current = data.current_condition[0];
      const desc = `${current.temp_C}°C, ${current.weatherDesc[0].value}`;
      const embed = interaction.client.createEmbed(interaction.guildId, { description: desc });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać pogody.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
