const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows bot uptime'),
  async execute(interaction) {
    const sec = Math.floor(process.uptime());
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    await interaction.reply(`Uptime: ${h}h ${m}m ${s}s`);
  }
};
