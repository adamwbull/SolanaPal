/* 
    SolanaPal Discord Bot
*/

// Import modules.
import 'dotenv/config.js';
import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(process.env.BOT_TOKEN);