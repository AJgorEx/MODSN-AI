const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Wyświetla aktualną pogodę dla wybranego miasta')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    )
    .addStringOption(o =>
      o.setName('city').setDescription('Nazwa miasta').setRequired(true))
    .addStringOption(o =>
      o.setName('units')
        .setDescription('Jednostki: metric lub imperial')
        .setRequired(false)
    ),
  async execute(interaction) {
    const city = interaction.options.getString('city');
    const units = interaction.options.getString('units') || 'metric';
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    try {
      const format = units === 'imperial' ? 'u' : 'm';
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&${format}`);
      const data = await response.json();
      const current = data.current_condition[0];
      const temp = units === 'imperial' ? `${current.temp_F}°F` : `${current.temp_C}°C`;
      const desc = `${temp}, ${current.weatherDesc[0].value}`;
      const embed = interaction.client.createEmbed(interaction.guildId, { description: desc });
      await interaction.reply({ embeds: [embed], ephemeral });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się pobrać pogody.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
