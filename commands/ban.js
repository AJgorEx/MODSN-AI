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
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Nie masz uprawnień do banowania użytkowników.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('uzytkownik');
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie mogę znaleźć użytkownika.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    try {
      await member.ban();
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Użytkownik ${member.user.tag} został zbanowany.` });
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się zbanować użytkownika.' });
      interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
