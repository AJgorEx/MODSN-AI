const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Wyświetla informacje o użytkowniku'),
  async execute(interaction) {
    const user = interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const embed = {
      color: 0x0099ff,
      title: user.tag,
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: 'Dołączył na serwer', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Utworzone konto', value: user.createdAt.toDateString(), inline: true }
      ]
    };
    await interaction.reply({ embeds: [embed] });
  }
};
