<img src="https://github.com/cappycap/SolanaPal/blob/main/branding/logo.png" width=50% height=50%>

# SolanaPal v1.1.0
Discord bot for interacting with the Solana blockchain.

## Initial Setup

1. Create a bot in the [Discord Developer Panel](https://discord.com/developers/applications) using the material from the `/branding` directory.
2. Use the OAuth2 -> URL Generator in the Developer Panel to invite the bot to your server.
3. Ensure bot has administrator privileges. 

## Deployment

Coming soon!

## Commands

`/nfts <address>` - View a catalog Metaplex-based NFTs for a given address.

`/profile <address>` - View a basic profile for a given address including Solana balance and transaction history.

## Planned Commands

`/link` - Begin the process to link a Solana wallet to your Discord.

`/pay <address> <amount>` - Available after linking your wallet, pay a given address a specified amount in SOL.

## Thanks To...
- [Discord.js](https://github.com/discordjs/discord.js) for their excellent bot library to interact with Discord API.
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) for their web3/solana interaction library.
