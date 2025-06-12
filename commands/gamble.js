const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble coins with a 50% chance to double them')
    .addIntegerOption(o =>
      o.setName('amount').setDescription('Amount to gamble').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    try {
      const reward = interaction.client.economy.gamble(interaction.user.id, amount);
      if (reward > 0) {
        await interaction.reply(`You won and gained ${reward} coins!`);
      } else {
        await interaction.reply(`You lost ${amount} coins.`);
      }
    } catch (e) {
      await interaction.reply({ content: 'Gamble failed: ' + e.message, ephemeral: true });
    }
  }
};
