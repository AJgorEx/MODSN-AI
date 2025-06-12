// Load environment variables
require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const startWebServer = require('./web/server');

const configPath = path.join(__dirname, 'commands-config.json');
let commandStatus = {};
try {
  commandStatus = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (_) {
  commandStatus = {};
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.commandStatus = commandStatus;
client.saveCommandStatus = function () {
  fs.writeFileSync(configPath, JSON.stringify(client.commandStatus, null, 2));
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
  if (client.commandStatus[interaction.commandName] === false) {
    return interaction.reply({ content: 'Ta komenda jest wyłączona.', ephemeral: true });
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
