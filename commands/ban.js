const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banuje wskazanego użytkownika')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Użytkownik do zbanowania')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'Nie masz uprawnień do banowania użytkowników.', ephemeral: true });
    }
    const member = interaction.options.getMember('user');
    if (!member) {
      return interaction.reply({ content: 'Nie znaleziono użytkownika.', ephemeral: true });
    }
    try {
      await member.ban();
      await interaction.reply(`Użytkownik ${member.user.tag} został zbanowany.`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Nie udało się zbanować użytkownika.', ephemeral: true });
    }
  }
};
