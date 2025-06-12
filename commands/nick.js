const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Changes a user\'s nickname')
    .addUserOption(o => o.setName('user').setDescription('User to change').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('New nickname').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const name = interaction.options.getString('name');
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });
    await member.setNickname(name).catch(() => {});
    await interaction.reply({ content: `Changed nickname for ${member.user.tag}.`, ephemeral: true });
  }
};
