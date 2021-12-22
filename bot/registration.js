/* 
    SolanaPal Discord Bot Registration File
*/

// Import modules.
const fs = require('fs');
require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Build command list.
const commands = []; 
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

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