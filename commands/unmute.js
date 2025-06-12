const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Removes timeout from a user')
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'User not found.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    await member.timeout(null).catch(() => {});
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Unmuted ${member.user.tag}.` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
