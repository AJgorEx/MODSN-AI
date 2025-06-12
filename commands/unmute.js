const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Removes timeout from a user')
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });
    await member.timeout(null).catch(() => {});
    await interaction.reply({ content: `Unmuted ${member.user.tag}.`, ephemeral: true });
  }
};
