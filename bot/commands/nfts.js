require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders');
const web3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const {
  metadata: { Metadata }
} = programs;
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { ButtonPaginator, SelectPaginator } = require('@psibean/discord.js-pagination');

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

		// Defer reply until pages generate.
		await interaction.reply("Connecting to Solana...");

		// Grab address from option.
		var address = interaction.options._hoistedOptions[0].value;

		try {

			// Create publicKey.
			// John's wallet for testing: LxAuDBo4eBkJ9x64EzWAyPXaFSRvQj8Fhk3TKaoRN7f
			var publicKey = new web3.PublicKey(address);

			await interaction.editReply("Wallet found, scanning for NFTs! This may take a minute depending on collection size.")

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

			if (accounts.value.length > 0) {

				// For each account, get data...
				var pages = [];

				for (var j = 0; j < accounts.value.length; j++) {

					// Convert buffer to a base64 string.
					var accountData = accounts.value[j].account.data;
					var parsed = accountData.toString("base64");

					// Get proper data buf from base64 string.
					var fullUTFBuf = Buffer.from(parsed, "base64"); 
					var fullB64Buf = Buffer.from(fullUTFBuf, "utf8");

					// Isolate mint address.
					var mintBuf = fullB64Buf.slice(0,32)

					// Convert buf to PublicKey.
					var mintHolderKey = null
					try {
						mintHolderKey = new web3.PublicKey(mintBuf);
					} catch (error) {
						continue
					}

					// Convert to address.
					var mintAddress = mintHolderKey.toString()

					// Get Metaplex data uri.
					const metaConn = new Connection(process.env.NET);

					var mintPubKey = null
					try {
						mintPubKey = new web3.PublicKey(mintAddress);
					} catch (error) {
						continue
					}
					
					// Ensure pda exists.
					var pda = null
					try {
						pda = await Metadata.getPDA(mintPubKey);
					} catch (error) {
						continue
					}

					// Retrieve metaplex data.
					var metaplexData = null;
					try {
						metaplexData = await Metadata.load(metaConn, pda);
					} catch (error) {
						continue
					}

					/*
					var oldData = {
						"name":metaplexData.data.data.name,
						"symbol":metaplexData.data.data.symbol,
						"uri":metaplexData.data.data.uri,
						"sellerFeeBasisPoints":metaplexData.data.data.sellerFeeBasisPoints,
						"data":metaplexData.info.data
					}
					*/

					// Check to see if this is a Metaplex NFT:
					if (metaplexData.data.data.uri.length > 0) {

						// Retrieve consolidated data.
						var data = null;
						try {
							data = await axios.get(metaplexData.data.data.uri);
						} catch (error) {
							continue;
						}
						var data = data.data;

						// Begin generating embed by creating an array of fields.
						var embedFields = [];

						for (var i = 0; i < data.attributes.length; i++) {
							embedFields.push({
								name: data.attributes[i].trait_type,
								value: data.attributes[i].value,
								inline: true
							})
						}

						// Additional data.
						var solscan = "https://solscan.io/token/" + mintAddress
						var footerText = "Information requested by " + interaction.user.username

						var embed = new MessageEmbed();
						embed.setTitle(data.name);
						embed.setURL(solscan);
						embed.setDescription(data.description);
						embed.setThumbnail(data.image);
						embed.addFields(embedFields);
						embed.setFooter(footerText);

						pages.push(embed);

					}

				}

				// Check to see if NFTs were found.
				if (pages.length > 0) {

					/*// Build selection menu.
					var selectOptions = []
					for (var k = 0; k < pages.length; k++) {
						var embed = pages[k]
						selectOptions.push({
							label: embed.title,
							value: `${i+1}`,
							description: embed.description
						})
					}

					// Send pages.
					const selectPaginator = new SelectPaginator(interaction, {
						pages,
						selectOptions: selectOptions,
						}
					);
					await selectPaginator.send();*/

					const buttonPaginator = new ButtonPaginator(interaction, { pages });
					await buttonPaginator.send();

					await interaction.editReply("NFTs found!");
					console.log('NFTs delivered for wallet ' + address)

				} else {

					await interaction.editReply("The specified wallet doesn't own any NFTs.");

				}

			} else {

				await interaction.editReply("The specified wallet doesn't own any NFTs.");

			}

		} catch (error) {
			
			console.log('Error encountered for address',address)
			console.log(error)

			if (error.message == 'Invalid public key input') {
				await interaction.editReply("Invalid Solana address provided.");
			} else {
				await interaction.editReply("The bot ran into a problem! Let an admin know so they can fix it.");
			}
			

		}

	},
};