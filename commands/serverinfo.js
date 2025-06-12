const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server'),
  async execute(interaction) {
    const { guild } = interaction;
    const owner = await guild.fetchOwner();
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: guild.name,
      thumbnail: { url: guild.iconURL() },
      fields: [
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Created', value: guild.createdAt.toDateString(), inline: true },
        { name: 'Members', value: String(guild.memberCount), inline: true },
        { name: 'Channels', value: String(guild.channels.cache.size), inline: true },
        { name: 'Roles', value: String(guild.roles.cache.size), inline: true },
        { name: 'Boosts', value: String(guild.premiumSubscriptionCount || 0), inline: true }
      ]
    });
    await interaction.reply({ embeds: [embed] });
  }
};
