import { AptosAccount, AptosClient, HexString, FaucetClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

async function main() {
    try {
        console.log("Setting up DeFi Biometrics module...");
        
        // Initialize admin account from private key
        const privateKeyBytes = HexString.ensure(process.env.ADMIN_KEY || "").toUint8Array();
        const adminAccount = new AptosAccount(privateKeyBytes);
        
        console.log("Admin address:", adminAccount.address().hex());
        
        // Initialize clients
        const client = new AptosClient(NODE_URL);
        const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
        
        // Fund admin account if needed
        await faucetClient.fundAccount(adminAccount.address(), 100_000_000);
        
        // Initialize module
        const payload = {
            function: `${adminAccount.address().hex()}::credit_system::initialize_module`,
            type_arguments: [],
            arguments: []
        };

        const transaction = await client.generateTransaction(adminAccount.address(), payload);
        const signedTx = await client.signTransaction(adminAccount, transaction);
        const response = await client.submitTransaction(signedTx);
        await client.waitForTransaction(response.hash);
        
        console.log("Module initialized successfully!");
        console.log("Transaction hash:", response.hash);
        
    } catch (error) {
        console.error("Setup failed:", error);
    }
}

// Get admin key from environment
const adminKey = "0x37125a0ab14f05455932b45b2c3e6e562097f8c0e0d2277235da05b436a37086"; // This is from the test_admin profile
process.env.ADMIN_KEY = adminKey;

// Run setup
main();
