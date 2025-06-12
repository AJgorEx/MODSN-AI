// Load environment variables
require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const startWebServer = require('./web/server');
const EconomySystem = require('./economy');
const guildSettings = require('./guildSettings');
const economyConfig = require('./economyConfig');

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
client.economyConfig = economyConfig;

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

const usagePath = path.join(__dirname, 'data/command-usage.json');
let commandUsage = {};
try {
  commandUsage = JSON.parse(fs.readFileSync(usagePath, 'utf8'));
} catch (_) {
  commandUsage = {};
}
client.commandUsage = commandUsage;
client.saveCommandUsage = function () {
  fs.writeFileSync(usagePath, JSON.stringify(client.commandUsage, null, 2));
};
client.incrementCommandUsage = function (cmd) {
  if (!this.commandUsage[cmd]) this.commandUsage[cmd] = 0;
  this.commandUsage[cmd]++;
  this.saveCommandUsage();
};
client.getCommandUsage = function (cmd) {
  return this.commandUsage[cmd] || 0;
};

client.guildSettings = guildSettings;
client.getEmbedColor = function (guildId) {
  const color = guildSettings.get(guildId).color || '#5865F2';
  return parseInt(color.replace('#', ''), 16);
};
client.setEmbedColor = function (guildId, color) {
  guildSettings.set(guildId, { color });
};
client.createEmbed = function (guildId, data = {}) {
  const defaults = {
    color: this.getEmbedColor(guildId),
    timestamp: new Date(),
    footer: {
      text: this.user ? this.user.username : '',
      icon_url: this.user ? this.user.displayAvatarURL() : null
    }
  };
  return { ...defaults, ...data };
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
  client.incrementCommandUsage(interaction.commandName);
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

client.on('guildMemberAdd', member => {
  const settings = guildSettings.get(member.guild.id);
  if (settings.autoRole) {
    const role = member.guild.roles.cache.get(settings.autoRole);
    if (role) member.roles.add(role).catch(console.error);
  }
  if (settings.logChannel) {
    const logCh = member.guild.channels.cache.get(settings.logChannel);
    if (logCh) logCh.send({ content: `${member.user.tag} joined the server.` }).catch(console.error);
  }
  if (settings.welcomeChannel && settings.welcomeMessage) {
    const channel = member.guild.channels.cache.get(settings.welcomeChannel);
    if (channel) {
      const msg = settings.welcomeMessage.replace('{user}', `<@${member.id}>`);
      channel.send({ content: msg }).catch(console.error);
    }
  }
});

client.on('guildMemberRemove', member => {
  const settings = guildSettings.get(member.guild.id);
  if (settings.logChannel) {
    const logCh = member.guild.channels.cache.get(settings.logChannel);
    if (logCh) logCh.send({ content: `${member.user.tag} left the server.` }).catch(console.error);
  }
});

client.login(process.env.DISCORD_TOKEN);
