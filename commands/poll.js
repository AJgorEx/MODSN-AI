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
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `📊 **${question}**` });
    const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
    await pollMessage.react('👍');
    await pollMessage.react('👎');
  }
};
