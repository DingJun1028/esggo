require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config(); // To load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // [Eternal Secret] Optimized for Immutable Truth
      },
    },
  },
  networks: {
    // [Eternal Secret] Anchoring Networks
    hardhat: {
      chainId: 1337, // Local Truth Environment
    },
    // Configuration for Polygon Mainnet
    polygon: {
      url: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    // Configuration for Polygon Amoy Testnet (the new testnet)
    amoy: {
      url: process.env.AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // Your API key for Etherscan/Polygonscan
    // Obtain one at https://polygonscan.com/
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
