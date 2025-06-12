const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot repeats your message')
    .addStringOption(option =>
      option.setName('text').setDescription('Text to send').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const text = interaction.options.getString('text');
    const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Sent!' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
    await interaction.channel.send(text);
  }
};
