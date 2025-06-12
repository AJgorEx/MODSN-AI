const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user by ID')
    .addStringOption(o => o.setName('id').setDescription('User ID').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const id = interaction.options.getString('id');
    try {
      await interaction.guild.bans.remove(id);
      await interaction.reply({ content: `Unbanned <@${id}>`, ephemeral: true });
    } catch {
      await interaction.reply({ content: 'Failed to unban.', ephemeral: true });
    }
  }
};
