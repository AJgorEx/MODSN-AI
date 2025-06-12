const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Chooses between options')
    .addStringOption(option =>
      option.setName('options').setDescription('Comma separated options').setRequired(true)),
  async execute(interaction) {
    const opts = interaction.options.getString('options').split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length === 0) return interaction.reply('Provide some options separated by comma.');
    const choice = opts[Math.floor(Math.random() * opts.length)];
    await interaction.reply(`I choose: **${choice}**`);
  }
};
