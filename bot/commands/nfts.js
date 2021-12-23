require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders');
const web3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const {
  metadata: { Metadata }
} = programs;
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nfts')
		.setDescription('View a catalog of owned NFTs for a given address.')
		.addStringOption(option => 
			option.setName('address')
			.setDescription('Provide a Solana wallet address.')
			.setRequired(true)
		),
	async execute(interaction) {

		//console.log('interaction:',interaction)

		// Defer reply until embeds generate.
		await interaction.reply("Connecting to Solana...");

		// Grab address from option.
		var address = interaction.options._hoistedOptions[0].value;

		// Create publicKey.
 		// John's wallet for testing: LxAuDBo4eBkJ9x64EzWAyPXaFSRvQj8Fhk3TKaoRN7f
		var publicKey = new web3.PublicKey(address);

		// Connect to cluster
		var connection = new web3.Connection(
			web3.clusterApiUrl(process.env.NET),
			'confirmed',
		);

		// get account info
		// account data is bytecode that needs to be deserialized
		// serialization and deserialization is program specic
		let account = await connection.getAccountInfo(publicKey);

		// Get token filter's program Id to limit to NFTs.
		var nftToken = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

		// Filter NFT collection.
		var filter = { programId: nftToken };
		var accounts = await connection.getTokenAccountsByOwner(publicKey, filter);
		//console.log('accounts:',accounts)

		// For each account, get data...

		// Convert buffer to a base64 string.
		var accountData = accounts.value[0].account.data;
		var parsed = accountData.toString("base64");

		// Get proper data buf from base64 string.
		var fullUTFBuf = Buffer.from(parsed, "base64"); 
		var fullB64Buf = Buffer.from(fullUTFBuf, "utf8");

		// Isolate mint address.
		var mintBuf = fullB64Buf.slice(0,32)

		// Convert buf to PublicKey.
		var mintHolderKey = new web3.PublicKey(mintBuf)

		// Convert to address.
		var mintAddress = mintHolderKey.toString()

		// Get Metaplex data uri.
		const metaConn = new Connection(process.env.NET);
		const mintPubKey = new web3.PublicKey(mintAddress);
		const pda = await Metadata.getPDA(mintPubKey);
		const metaplexData = await Metadata.load(metaConn, pda);
		/*
		var oldData = {
			"name":metaplexData.data.data.name,
			"symbol":metaplexData.data.data.symbol,
			"uri":metaplexData.data.data.uri,
			"sellerFeeBasisPoints":metaplexData.data.data.sellerFeeBasisPoints,
			"data":metaplexData.info.data
		}
		*/

		// Retrieve consolidated data.
		var data = await axios.get(metaplexData.data.data.uri)
		var data = data.data

		console.log('data:',data)

		// Begin generating embed by creating an array of fields.
		var embedFields = []

		for (var i = 0; i < data.attributes.length; i++) {
			console.log('attrib:',data.attributes[i])
			embedFields.push({
				name: data.attributes[i].trait_type,
				value: data.attributes[i].value,
				inline: true
			})
		}

		// Additional data.
		var solscan = "https://solscan.io/token/" + mintAddress
		var footerText = "Information requested by " + interaction.user.username

		var embed = {
			title: data.name,
			url: solscan,
			description: data.description,
			thumbnail: {
				url: data.image
			},
			fields: embedFields,
			footer: {
				text: footerText
			}
		}

		console.log('embed:',embed)

		await interaction.editReply("NFTs found!")
		await interaction.editReply({ embeds: [embed] })

	},
};