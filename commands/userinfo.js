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
    const roles = member.roles.cache
      .filter(r => r.name !== '@everyone')
      .map(r => r.name)
      .join(', ') || 'Brak';
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: user.tag,
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Dołączył na serwer', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Utworzone konto', value: user.createdAt.toDateString(), inline: true },
        { name: 'Role', value: roles, inline: false }
      ]
    });
    await interaction.reply({ embeds: [embed] });
  }
};
