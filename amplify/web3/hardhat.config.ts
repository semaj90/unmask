require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    edu: {
      url: process.env.EDU_URL,
      chainId: 656476,
      accounts: [process.env.PRIVATE_KEY],
    },
    fuji: {
      url: process.env.FUJI_URL,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};