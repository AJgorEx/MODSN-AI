const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Removes a role from a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');
    if (!member || !role) return interaction.reply({ content: 'Invalid user or role.', ephemeral: true });
    await member.roles.remove(role).catch(() => {});
    await interaction.reply({ content: `Role removed from ${member.user.tag}.`, ephemeral: true });
  }
};
