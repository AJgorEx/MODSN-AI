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
      let desc = '';
      if (reward > 0) {
        desc = `You won and gained ${reward} coins!`;
      } else {
        desc = `You lost ${amount} coins.`;
      }
      const embed = interaction.client.createEmbed(interaction.guildId, { description: desc });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      const embedErr = interaction.client.createEmbed(interaction.guildId, { description: 'Gamble failed: ' + e.message });
      await interaction.reply({ embeds: [embedErr], ephemeral: true });
    }
  }
};
