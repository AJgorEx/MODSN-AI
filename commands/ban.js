const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banuje wskazanego użytkownika')
    .addUserOption(option =>
      option.setName('uzytkownik')
        .setDescription('Użytkownik do zbanowania')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'Nie masz uprawnień do banowania użytkowników.', ephemeral: true });
    }
    const member = interaction.options.getMember('uzytkownik');
    if (!member) {
      return interaction.reply({ content: 'Nie mogę znaleźć użytkownika.', ephemeral: true });
    }
    try {
      await member.ban();
      await interaction.reply(`Użytkownik ${member.user.tag} został zbanowany.`);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Nie udało się zbanować użytkownika.', ephemeral: true });
    }
  }
};
