const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banuje wskazanego użytkownika')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    )
    .addUserOption(option =>
      option.setName('uzytkownik')
        .setDescription('Użytkownik do zbanowania')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('days')
        .setDescription('Ile dni wiadomości usunąć (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
    )
    .addStringOption(o =>
      o.setName('reason')
        .setDescription('Powód bana')
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Nie masz uprawnień do banowania użytkowników.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const member = interaction.options.getMember('uzytkownik');
    const days = interaction.options.getInteger('days') ?? 0;
    const reason = interaction.options.getString('reason') ?? 'Brak powodu';
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    if (!member) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie mogę znaleźć użytkownika.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    try {
      await member.ban({ deleteMessageDays: days, reason });
      const embed = interaction.client.createEmbed(interaction.guildId, { description: `Użytkownik ${member.user.tag} został zbanowany. Powód: ${reason}` });
      await interaction.reply({ embeds: [embed], ephemeral });
    } catch (err) {
      console.error(err);
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Nie udało się zbanować użytkownika.' });
      interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
