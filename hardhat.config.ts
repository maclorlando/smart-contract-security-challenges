import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.28" },
      { version: "0.6.2" },
      { version: "0.6.12" },
      { version: "0.8.0" },
      {
        version: "0.4.21",
        settings: {
          optimizer: {
            enabled: false,
          },
          evmVersion: "byzantium",
        },
      },
    ],
    overrides: {
      "contracts/TokenBankChallenge.sol": {
        version: "0.4.21",
      },
      "contracts/TokenBankSolver.sol": {
        version: "0.4.21",
      },
      "contracts/TokenWhaleChallenge.sol": {
        version: "0.4.21",
        settings: {
          optimizer: { enabled: false },
          evmVersion: "byzantium",
        },
      },
      "contracts/TokenWhaleSolver.sol": {
        version: "0.4.21",
        settings: {
          optimizer: { enabled: false },
          evmVersion: "byzantium",
        },
      },
    },

  },
};

export default config;
