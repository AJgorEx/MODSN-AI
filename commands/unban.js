const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user by ID')
    .addStringOption(o => o.setName('id').setDescription('User ID').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const id = interaction.options.getString('id');
    try {
      await interaction.guild.bans.remove(id);
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Unbanned <@${id}>` });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Failed to unban.' });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
