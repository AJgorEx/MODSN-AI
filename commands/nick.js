const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Changes a user\'s nickname')
    .addUserOption(o => o.setName('user').setDescription('User to change').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('New nickname').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const name = interaction.options.getString('name');
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'User not found.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    await member.setNickname(name).catch(() => {});
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Changed nickname for ${member.user.tag}.` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
