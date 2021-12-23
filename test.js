require('dotenv').config()
const web3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const {
  metadata: { Metadata }
} = programs;

(async () => {

  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl(process.env.NET),
    'confirmed',
  );

  // Create publicKey.
  var publicKey = new web3.PublicKey('LxAuDBo4eBkJ9x64EzWAyPXaFSRvQj8Fhk3TKaoRN7f');

  // get account info
  // account data is bytecode that needs to be deserialized
  // serialization and deserialization is program specic
  let account = await connection.getAccountInfo(publicKey);
  console.log(account);

  // Get token filter's program Id to limit to NFTs.
  var nftToken = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

  // Filter NFT collection.
  var filter = { programId: nftToken };
  var accounts = await connection.getTokenAccountsByOwner(publicKey, filter);
  //console.log('accounts:',accounts)

  // For each account, get data...
  console.log('')
  console.log(accounts.value[0])
  console.log('')

  // Convert buffer to a base64 string.
  var accountData = accounts.value[0].account.data;
  var parsed = accountData.toString("base64");
  console.log('parsed:',parsed);
  console.log('')

  // Get proper data buf from base64 string.
  var fullUTFBuf = Buffer.from(parsed, "base64"); 
  var fullB64Buf = Buffer.from(fullUTFBuf, "utf8");

  // Isolate mint.
  var mintBuf = fullB64Buf.slice(0,32)
  console.log('mintBuf:',mintBuf);
  console.log('')

  // Convert buf to PublicKey.
  var mintHolderKey = new web3.PublicKey(mintBuf)

  // Convert to address.
  var mintAddress = mintHolderKey.toString()
  console.log('mintAddress:',mintAddress);
  console.log('')

  // Get Metaplex data.
  const metaConn = new Connection(process.env.NET);

  const mintPubKey = new web3.PublicKey(mintAddress);
  const pda = await Metadata.getPDA(mintPubKey);

  const data = await Metadata.load(metaConn, pda);

  // Consolidate data.
  var deliveredData = {
    "name":data.data.data.name,
    "symbol":data.data.data.symbol,
    "uri":data.data.data.uri,
    "sellerFeeBasisPoints":data.data.data.sellerFeeBasisPoints,
    "data":data.info.data
  }
  console.log(deliveredData)

})();