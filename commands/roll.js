const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a dice')
    .addIntegerOption(opt =>
      opt.setName('sides')
        .setDescription('Number of sides (default 6)')
        .setMinValue(2)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `You rolled **${result}** (1-${sides})` });
    await interaction.reply({ embeds: [embed] });
  }
};
