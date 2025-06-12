const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Create a new role')
    .addStringOption(o =>
      o.setName('name').setDescription('Role name').setRequired(true))
    .addStringOption(o =>
      o.setName('color').setDescription('Hex color, optional')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const name = interaction.options.getString('name');
    let color = interaction.options.getString('color');
    if (color) {
      if (!/^#?[0-9A-Fa-f]{6}$/.test(color)) {
        return interaction.reply({ content: 'Invalid color.', ephemeral: true });
      }
      if (!color.startsWith('#')) color = `#${color}`;
    }
    try {
      const role = await interaction.guild.roles.create({ name, color });
      await interaction.reply({ content: `Created role ${role.name}.`, ephemeral: true });
    } catch (_) {
      await interaction.reply({ content: 'Failed to create role.', ephemeral: true });
    }
  }
};
