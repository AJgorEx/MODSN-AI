const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdź czy bot działa')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    ),
  async execute(interaction) {
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Pong! **${latency}ms**` });
    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
