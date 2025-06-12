module.exports = {
  name: 'userinfo',
  description: 'Wyświetla informacje o użytkowniku',
  execute(message) {
    const user = message.author;
    const member = message.guild.members.cache.get(user.id);
    const embed = {
      color: 0x0099ff,
      title: user.tag,
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: 'Dołączył na serwer', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Utworzone konto', value: user.createdAt.toDateString(), inline: true }
      ]
    };
    message.channel.send({ embeds: [embed] });
  }
};
