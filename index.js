// Load environment variables
require('dotenv').config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command && command.data && command.execute) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
}

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Registered slash commands');
  } catch (err) {
    console.error('❌ Failed to register commands', err);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
    }
  }
});

client.login(token);
