const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Adds a role to a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');
    if (!member || !role) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Invalid user or role.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    await member.roles.add(role).catch(() => {});
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Role added to ${member.user.tag}.` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
