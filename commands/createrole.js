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
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const name = interaction.options.getString('name');
    let color = interaction.options.getString('color');
    if (color) {
      if (!/^#?[0-9A-Fa-f]{6}$/.test(color)) {
        const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Invalid color.' });
        return interaction.reply({ embeds: [embedErr], ephemeral: true });
      }
      if (!color.startsWith('#')) color = `#${color}`;
    }
    try {
      const role = await interaction.guild.roles.create({ name, color });
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Created role ${role.name}.` });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (_) {
      const embedErr2 = interaction.client.createEmbed(interaction.guildId, { description: 'Failed to create role.' });
      await interaction.reply({ embeds: [embedErr2], ephemeral: true });
    }
  }
};
