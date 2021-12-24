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
  try {
      var publicKey = new web3.PublicKey('test');
  } catch (error) {
      console.log(error)
  }

  console.log(web3.PublicKey.isOnCurve('blablabla'))
  console.log(web3.PublicKey.isOnCurve('LxAuDBo4eBkJ9x64EzWAyPXaFSRvQj8Fhk3TKaoRN7f'))

})();