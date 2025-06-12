const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Times out a user for minutes')
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });
    await member.timeout(minutes * 60 * 1000).catch(() => {});
    await interaction.reply({ content: `Muted ${member.user.tag} for ${minutes} minutes.`, ephemeral: true });
  }
};
