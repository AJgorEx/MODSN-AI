require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.content === '!siema') {
    message.reply('Siemano, co tam wariacie?');
  }
});

client.login(process.env.DISCORD_TOKEN);
