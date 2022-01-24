const { mnemonicToMasterDerivationKey } = require('algosdk');
const algosdk = require('algosdk');
export const createAccount = function() {
    try {
        console.log("whaaat");
        const myaccount = algosdk.generateAccount();
        console.log("Account Address = " + myaccount.addr);
        const account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Account Mnemonic = "+ account_mnemonic);
        console.log("Account created. Save off Mnemonic and address");
        console.log("Add funds to account using the TestNet Dispenser: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");
        return myaccount;
    }
    catch (err) {
        console.log("err", err);
    }
};
async function firstTransaction() {

    try {
        const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const algodServer = 'http://localhost';
        const algodPort = 4001;
        const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    }
    catch(err) {
        console.log("err",err)
    }
}

// createAccount();