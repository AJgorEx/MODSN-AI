const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Wysyła przypomnienie po określonym czasie')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl przypomnienie prywatnie')
    )
    .addIntegerOption(o =>
      o.setName('minutes').setDescription('Za ile minut').setRequired(true).setMinValue(1))
    .addStringOption(o =>
      o.setName('text').setDescription('Treść przypomnienia').setRequired(true)),
  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const text = interaction.options.getString('text');
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    const embed = interaction.client.createEmbed(interaction.guildId, {
      description: `Przypomnę za ${minutes} minut: ${text}`
    });
    await interaction.reply({ embeds: [embed], ephemeral });
    setTimeout(() => {
      interaction.followUp({ content: `<@${interaction.user.id}> ${text}`, ephemeral });
    }, minutes * 60 * 1000);
  }
};
