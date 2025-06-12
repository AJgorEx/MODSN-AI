const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Times out a user for minutes')
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'User not found.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    await member.timeout(minutes * 60 * 1000).catch(() => {});
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Muted ${member.user.tag} for ${minutes} minutes.` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
