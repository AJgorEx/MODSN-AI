const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Chooses between options')
    .addStringOption(option =>
      option.setName('options').setDescription('Comma separated options').setRequired(true)),
  async execute(interaction) {
    const opts = interaction.options.getString('options').split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length === 0) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Provide some options separated by comma.' });
      return interaction.reply({ embeds: [embedErr] });
    }
    const choice = opts[Math.floor(Math.random() * opts.length)];
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `I choose: **${choice}**` });
    await interaction.reply({ embeds: [embed] });
  }
};
