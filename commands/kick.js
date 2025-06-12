const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Wyrzuca wskazanego użytkownika z serwera')
    .addUserOption(option =>
      option.setName('uzytkownik')
        .setDescription('Użytkownik do wyrzucenia')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'Nie masz uprawnień do wyrzucania użytkowników.', ephemeral: true });
    }
    const member = interaction.options.getMember('uzytkownik');
    if (!member) {
      return interaction.reply({ content: 'Nie mogę znaleźć użytkownika.', ephemeral: true });
    }
    try {
      await member.kick();
      await interaction.reply(`Użytkownik ${member.user.tag} został wyrzucony.`);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Nie udało się wyrzucić użytkownika.', ephemeral: true });
    }
  }
};
