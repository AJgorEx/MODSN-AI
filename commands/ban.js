const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Banuje wskazanego użytkownika',
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Nie masz uprawnień do banowania użytkowników.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Oznacz użytkownika do zbanowania.');
    }
    try {
      await member.ban();
      message.channel.send(`Użytkownik ${member.user.tag} został zbanowany.`);
    } catch (err) {
      console.error(err);
      message.reply('Nie udało się zbanować użytkownika.');
    }
  }
};
