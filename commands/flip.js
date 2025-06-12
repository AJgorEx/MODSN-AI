const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flips a coin'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = interaction.client.createEmbed(interaction.guildId, { description: result });
    await interaction.reply({ embeds: [embed] });
  }
};
