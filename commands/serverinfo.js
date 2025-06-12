const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server'),
  async execute(interaction) {
    const { guild } = interaction;
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: guild.name,
      fields: [
        { name: 'Members', value: String(guild.memberCount), inline: true }
      ]
    });
    await interaction.reply({ embeds: [embed] });
  }
};
