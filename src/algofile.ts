const { mnemonicToMasterDerivationKey } = require('algosdk');
import algosdk, { Account, makeAssetCreateTxn, waitForConfirmation } from "algosdk";
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
export const createAccount = async function(client: AlgodClient) {
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

export const OptIn = async (account: Account, client: AlgodClient) => {
     // paste in the asset id from the create asset tutorial
     const assetID = 67736927;
     // Opting in to an Asset:
     // Opting in to transact with the new asset
     // Allow accounts that want recieve the new asset
     // Have to opt in. To do this they send an asset transfer
     // of the new asset to themseleves
     // In this example we are setting up the 3rd recovered account to
     // receive the new asset

     // First update changing transaction parameters
     // We will account for changing transaction parameters
     // before every transaction in this example
     const params = await client.getTransactionParams().do();
     // comment out the next two lines to use suggested fee
     params.fee = 1000;
     params.flatFee = true;

     const sender = account.addr;
     const recipient = sender;
     // We set revocationTarget to undefined as
     // This is not a clawback operation
     let revocationTarget;
     // CloseReaminerTo is set to undefined as
     // we are not closing out an asset
     let closeRemainderTo;
     // We are sending 0 assets
     const amount = 0;
     const note:any = undefined


     // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
     const opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
          amount, note, assetID, params);

     const rawSignedTxn = opttxn.signTxn(account.sk);
     const tx = await client.sendRawTransaction(rawSignedTxn).do();
     console.log(tx.Id);

     await waitForConfirmation(client, tx.txId,1000);

     console.log("opted in for account: " + account);
}

// createAccount();