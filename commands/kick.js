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
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Nie masz uprawnień do wyrzucania użytkowników.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('uzytkownik');
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie mogę znaleźć użytkownika.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    try {
      await member.kick();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Użytkownik ${member.user.tag} został wyrzucony.` });
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się wyrzucić użytkownika.' });
      interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
