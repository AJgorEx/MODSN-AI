const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Wyrzuca wskazanego użytkownika z serwera',
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Nie masz uprawnień do wyrzucania użytkowników.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Oznacz użytkownika do wyrzucenia.');
    }
    try {
      await member.kick();
      message.channel.send(`Użytkownik ${member.user.tag} został wyrzucony.`);
    } catch (err) {
      console.error(err);
      message.reply('Nie udało się wyrzucić użytkownika.');
    }
  }
};
