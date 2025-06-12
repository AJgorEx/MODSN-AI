const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Wyświetla listę komend')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    ),
  async execute(interaction) {
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    const commands = interaction.client.commands
      .map(cmd => {
        const count = interaction.client.getCommandUsage(cmd.data.name);
        return `**/${cmd.data.name}** - ${cmd.data.description} (użyto ${count}x)`;
      })
      .join('\n');
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Dostępne komendy:\n${commands}` });
    await interaction.reply({ embeds: [embed], ephemeral });
  }
};
