import "@nomicfoundation/hardhat-ethers";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
    solidity: "0.8.28",
    networks: {
        // Add polygon mumbai or base testnets here, for local testing use hardhat localhost
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
