const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nfts')
		.setDescription('View a catalog of owned NFTs for a given address.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};