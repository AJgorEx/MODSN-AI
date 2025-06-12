const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Wyświetla informacje o użytkowniku')
    .addUserOption(option =>
      option.setName('uzytkownik')
        .setDescription('Użytkownik, o którym chcesz uzyskać informacje')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('uzytkownik') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
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
