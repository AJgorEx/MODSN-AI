const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdź czy bot działa'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Pong! **${latency}ms**` });
    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
