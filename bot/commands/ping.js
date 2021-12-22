const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('What is a bot without an epic ping command?'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};