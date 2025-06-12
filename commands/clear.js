const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a number of messages')
    .addIntegerOption(option =>
      option.setName('amount').setDescription('1-100').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Missing permission.', ephemeral: true });
    }
    let amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'Enter a number between 1 and 100.', ephemeral: true });
    }
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
  }
};
