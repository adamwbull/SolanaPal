require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders');
const web3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const {
  metadata: { Metadata }
} = programs;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nfts')
		.setDescription('View a catalog of owned NFTs for a given address.'),
	async execute(interaction) {
	},
};