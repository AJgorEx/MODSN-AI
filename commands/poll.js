const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Tworzy prostą ankietę z reakcjami 👍 i 👎')
    .addStringOption(option =>
      option.setName('pytanie')
        .setDescription('Treść ankiety')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('czas')
        .setDescription('Czas trwania w minutach')
        .setRequired(false)
        .setMinValue(1)
    ),
  async execute(interaction) {
    const question = interaction.options.getString('pytanie');
    const duration = interaction.options.getInteger('czas');
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `📊 **${question}**` });
    const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
    await pollMessage.react('👍');
    await pollMessage.react('👎');
    if (duration) {
      setTimeout(async () => {
        const fetched = await interaction.channel.messages.fetch(pollMessage.id);
        const up = fetched.reactions.cache.get('👍')?.count - 1 || 0;
        const down = fetched.reactions.cache.get('👎')?.count - 1 || 0;
        const result = interaction.client.createEmbed(interaction.guildId, { description: `Wynik ankiety: 👍 ${up} / 👎 ${down}` });
        interaction.followUp({ embeds: [result] });
      }, duration * 60 * 1000);
    }
  }
};
