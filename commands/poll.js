const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Tworzy prostą ankietę z reakcjami 👍 i 👎')
    .addStringOption(option =>
      option.setName('pytanie')
        .setDescription('Treść ankiety')
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString('pytanie');
    const pollMessage = await interaction.channel.send(`\uD83D\uDCCA **${question}**`);
    await pollMessage.react('👍');
    await pollMessage.react('👎');
    await interaction.reply({ content: 'Ankieta utworzona', ephemeral: true });
  }
};
