// Load environment variables
require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const startWebServer = require('./web/server');
const EconomySystem = require('./economy');

const configPath = path.join(__dirname, 'commands-config.json');
let commandStatus = {};
try {
  const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (data.default && data.guilds) {
    commandStatus = data;
  } else {
    commandStatus = { default: data, guilds: {} };
  }
} catch (_) {
  commandStatus = { default: {}, guilds: {} };
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

client.economy = new EconomySystem(path.join(__dirname, 'data/economy.json'));
client.economy.load();

client.commands = new Collection();
client.commandStatus = commandStatus;
client.saveCommandStatus = function () {
  fs.writeFileSync(configPath, JSON.stringify(client.commandStatus, null, 2));
};
client.isCommandEnabled = function (guildId, command) {
  const guildCfg = client.commandStatus.guilds[guildId] || {};
  if (typeof guildCfg[command] !== 'undefined') return guildCfg[command];
  return client.commandStatus.default[command] !== false;
};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command && command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  startWebServer(client);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  if (!client.isCommandEnabled(interaction.guildId, interaction.commandName)) {
    return interaction.reply({ content: 'Ta komenda jest wyłączona na tym serwerze.', ephemeral: true });
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      interaction.followUp({ content: '❌ Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
    } else {
      interaction.reply({ content: '❌ Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
