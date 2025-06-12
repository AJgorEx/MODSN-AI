const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Odpowiada na pytania tak/nie')
    .addStringOption(option =>
      option.setName('pytanie')
        .setDescription('Twoje pytanie')
        .setRequired(true)
    ),
  async execute(interaction) {
    const responses = [
      'Tak',
      'Nie',
      'Może',
      'Z pewnością',
      'Wątpię',
      'Oczywiście',
      'Nie chcesz wiedzieć'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(response);
  }
};
