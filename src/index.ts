import express from "express";
import algosdk, { makeAssetCreateTxn } from "algosdk";
import { INVALID_MSIG_VERSION_ERROR_MSG } from "algosdk/dist/types/src/encoding/address";
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import { validate_escrow_wallet } from "./helper";
import { createAccount } from "./algofile";
import AccountInformation from "algosdk/dist/types/src/client/v2/algod/accountInformation";
import { mnemonicToSecretKey } from "algosdk";
import path, { parse } from "path";

const app = express();
const port = 8080; // default port to listen
const mmenonic = "glance fame avocado team tobacco spoon actress author situate swarm embark check design reform radio alien bachelor matter best diesel whip select idle absorb film";

const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const getClient = () : AlgodClient => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
}
const client = getClient();

const waitForConfirmation = async function (algodclient: AlgodClient, txId: string) {
    const response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            // Got the completed Transaction
            console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
};


// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodclient: AlgodClient, account: string, assetid: string) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    const accountInfo = await algodclient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
        const scrutinizedAsset = accountInfo['created-assets'][idx];
        if (scrutinizedAsset.index == assetid) {
            console.log("AssetID = " + scrutinizedAsset.index);
            const myparms = JSON.stringify(scrutinizedAsset.params, undefined, 2);
            console.log("parms = " + myparms);
            break;
        }
    }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodclient: AlgodClient, account: string, assetid: string) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    const accountInfo = await algodclient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo.assets.length; idx++) {
        const scrutinizedAsset = accountInfo.assets[idx];
        if (scrutinizedAsset['asset-id'] == assetid) {
            const myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.log("assetholdinginfo = " + myassetholding);
            break;
        }
    }
};

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    const filePath = process.cwd() + '/src/public/index.html';
    res.sendFile(filePath);
} );

app.post( "/validateWallet", async ( req, res ) => {
    try{
    const body = req.body
    // console.log(req.body)
    const validateResult = await validate_escrow_wallet(body.address as string,body.mmenonic as string, client);
    res.send( "Hello world!" + "address is: " + body.address + " mmenonic is " + body.mmenonic + "is it valid " + validateResult);
    }catch(e){

    }
} );
app.post("/createAsset", async (req , res) => {
    try{
    const address = mnemonicToSecretKey(mmenonic).addr;
    const sk = mnemonicToSecretKey(mmenonic).sk
    const params = await client.getTransactionParams().do();
    console.log(params);
    const note = new Uint8Array(0);
    const defaultFrozen = false;
    const decimals = 0;
    const totalIssuance = 10000;
    const unitName = "TCC";
    const assetName = "TestChoiceCoin";
    const assetURL = "http://someurl";
    const assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
    const manager = address
    const reserve = address
    const freeze = address
    const clawback = address
    /*let defaultFrozen = false;
    let totalIssuance = 1000;
    let decimals = 0;
    let reserve = addr;
    let freeze = addr;
    let clawback = addr;
    let manager = addr;
    let unitName = "DC1";
    let assetName = "dumbcoin001";
    let note = new Uint8Array(0);
    let assetURL = "http://someurl";*/
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(address, note,
         totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
        clawback, unitName, assetName, assetURL, assetMetadataHash, params);

    const rawSignedTxn = txn.signTxn(sk)
    console.log(txn)
    const tx = await client.sendRawTransaction(rawSignedTxn).do();

    console.log("Transaction : " + tx.txId);
    let assetID = null;
    // wait for transaction to be confirmed
    await waitForConfirmation(client, tx.txId);
    // Get the new asset's information from the creator account
    const ptx = await client.pendingTransactionInformation(tx.txId).do();
    assetID = ptx["asset-index"];
   // console.log("AssetID = " + assetID);

    await printCreatedAsset(client, address, assetID);
    await printAssetHolding(client, address, assetID);

    res.send("OK ok");

    }catch(e){
        console.log("what");
        console.log(e)
    }
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

app.post("/createAccount", async(req,res) => {
    createAccount()
});