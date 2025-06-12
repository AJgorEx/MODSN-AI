const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot repeats your message')
    .addStringOption(option =>
      option.setName('text').setDescription('Text to send').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const text = interaction.options.getString('text');
    await interaction.reply({ content: 'Sent!', ephemeral: true });
    await interaction.channel.send(text);
  }
};
