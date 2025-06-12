const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Sends the avatar of a user')
    .addUserOption(option =>
      option.setName('user').setDescription('User to get avatar of')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const ext = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: user.tag,
      image: { url: user.displayAvatarURL({ extension: ext, size: 512 }) }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
