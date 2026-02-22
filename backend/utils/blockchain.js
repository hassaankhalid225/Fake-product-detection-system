const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function getContractInstance() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(process.env.CCP_PATH || '../network/connection-org1.json');
        const fileExists = fs.existsSync(ccpPath);
        if (!fileExists) {
            console.warn(`Connection profile not found at ${ccpPath}. Blockchain interactions will be mocked.`);
            return null;
        }
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet. Run enrollment script first.');
            return null;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME || 'mychannel');

        // Get the contract from the network.
        const contract = network.getContract(process.env.CHAINCODE_NAME || 'product-verification');

        return { contract, gateway };
    } catch (error) {
        console.error(`Failed to get contract instance: ${error}`);
        return null;
    }
}

module.exports = { getContractInstance };
