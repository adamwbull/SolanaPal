<p align="center">
<img src="https://github.com/cappycap/SolanaPal/blob/main/branding/logo.png" width=30% height=30%>
</p>

# SolanaPal v1.1.0
Discord bot for interacting with the Solana blockchain.

## Initial Setup

1. Create an application in the [Discord Developer Panel](https://discord.com/developers/applications) using the material from the `/branding` directory.
2. Create a bot in the Bot -> Add Bot section of the Developer Panel.
3. Invite the bot to your server using the following link: `https://discord.com/api/oauth2/authorize?client_id=<YOUR_APPLICATION_CLIENT_ID>&permissions=8&scope=applications.commands%20bot` where `<YOUR_APPLICATION_CLIENT_ID>` is the Application ID available in the General Information tab of the Developer Panel.
4. Ensure bot has administrator privileges via an assigned role. 

## Deployment

1. Clone the repo onto your own machine using `git clone https://github.com/cappycap/SolanaPal.git`.
2. Update the `.env.example` file with your own variables, then rename it to `.env`
3. Open up a terminal, navigate to repo directory, then run `npm install` to install dependencies.
4. Run `npm run register` to register the bot's commands with Discord API.
5. Run `npm run bot` to spin up the bot.
6. Test the bot on your server!

## Commands

`/ping` - What is a bot without an epic ping command?

`/nfts <address>` - View a catalog of owned NFTs for a given address.

## Planned Commands

`/profile <address>` - View a basic profile for a given address including Solana balance and transaction history.

`/linkwallet` - Begin the process to link a Solana wallet to your Discord.

`/pay <address> <amount>` - Available after linking your wallet, pay a given address a specified amount in SOL.

## Thanks To...
- [Discord.js](https://github.com/discordjs/discord.js) for their bot library to interact with Discord API.
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) for their Solana library.
- [@metaplex/js](https://github.com/metaplex-foundation/js) for their library to interact with the Metaplex API.
