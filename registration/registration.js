/* 
    SolanaPal Discord Bot Registration File
*/

// Import modules.
import 'dotenv/config.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

// Command list.
const commands = [{
  name: 'ping',
  description: 'What is a bot without an epic ping command?'
}]; 

// Upload command list for the bot specified in .env.
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();