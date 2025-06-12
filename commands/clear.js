const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a number of messages')
    .addIntegerOption(option =>
      option.setName('amount').setDescription('1-100').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed = interaction.client.createEmbed(interaction.guildId, { description: 'Missing permission.' });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    let amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Enter a number between 1 and 100.' });
      return interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
    await interaction.channel.bulkDelete(amount, true);
    const embed = interaction.client.createEmbed(interaction.guildId, { description: `Deleted ${amount} messages.` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
