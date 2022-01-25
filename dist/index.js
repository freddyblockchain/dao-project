"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const algosdk_1 = __importDefault(require("algosdk"));
const helper_1 = require("./helper");
const algofile_1 = require("./algofile");
const algosdk_2 = require("algosdk");
const app = (0, express_1.default)();
const port = 8080; // default port to listen
const mmenonic = "glance fame avocado team tobacco spoon actress author situate swarm embark check design reform radio alien bachelor matter best diesel whip select idle absorb film";
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
const getClient = () => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk_1.default.Algodv2(algodToken, algodServer, algodPort);
};
const client = getClient();
const waitForConfirmation = function (algodclient, txId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield algodclient.status().do();
        let lastround = response["last-round"];
        while (true) {
            const pendingInfo = yield algodclient.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                // Got the completed Transaction
                console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
            }
            lastround++;
            yield algodclient.statusAfterBlock(lastround).do();
        }
    });
};
// Function used to print created asset for account and assetid
const printCreatedAsset = function (algodclient, account, assetid) {
    return __awaiter(this, void 0, void 0, function* () {
        // note: if you have an indexer instance available it is easier to just use this
        //     let accountInfo = await indexerClient.searchAccounts()
        //    .assetID(assetIndex).do();
        // and in the loop below use this to extract the asset for a particular account
        // accountInfo['accounts'][idx][account]);
        const accountInfo = yield algodclient.accountInformation(account).do();
        for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
            const scrutinizedAsset = accountInfo['created-assets'][idx];
            if (scrutinizedAsset.index == assetid) {
                console.log("AssetID = " + scrutinizedAsset.index);
                const myparms = JSON.stringify(scrutinizedAsset.params, undefined, 2);
                console.log("parms = " + myparms);
                break;
            }
        }
    });
};
// Function used to print asset holding for account and assetid
const printAssetHolding = function (algodclient, account, assetid) {
    return __awaiter(this, void 0, void 0, function* () {
        // note: if you have an indexer instance available it is easier to just use this
        //     let accountInfo = await indexerClient.searchAccounts()
        //    .assetID(assetIndex).do();
        // and in the loop below use this to extract the asset for a particular account
        // accountInfo['accounts'][idx][account]);
        const accountInfo = yield algodclient.accountInformation(account).do();
        for (let idx = 0; idx < accountInfo.assets.length; idx++) {
            const scrutinizedAsset = accountInfo.assets[idx];
            if (scrutinizedAsset['asset-id'] == assetid) {
                const myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
                console.log("assetholdinginfo = " + myassetholding);
                break;
            }
        }
    });
};
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.post("/validateWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        // console.log(req.body)
        const validateResult = yield (0, helper_1.validate_escrow_wallet)(body.address, body.mmenonic, client);
        res.send("Hello world!" + "address is: " + body.address + " mmenonic is " + body.mmenonic + "is it valid " + validateResult);
    }
    catch (e) {
    }
}));
app.post("/createAsset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = (0, algosdk_2.mnemonicToSecretKey)(mmenonic).addr;
        const sk = (0, algosdk_2.mnemonicToSecretKey)(mmenonic).sk;
        const params = yield client.getTransactionParams().do();
        console.log(params);
        const note = new Uint8Array(0);
        const defaultFrozen = false;
        const decimals = 0;
        const totalIssuance = 10000;
        const unitName = "TCC";
        const assetName = "TestChoiceCoin";
        const assetURL = "http://someurl";
        const assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
        const manager = address;
        const reserve = address;
        const freeze = address;
        const clawback = address;
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
        const txn = algosdk_1.default.makeAssetCreateTxnWithSuggestedParams(address, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash, params);
        const rawSignedTxn = txn.signTxn(sk);
        console.log(txn);
        const tx = yield client.sendRawTransaction(rawSignedTxn).do();
        console.log("Transaction : " + tx.txId);
        let assetID = null;
        // wait for transaction to be confirmed
        yield waitForConfirmation(client, tx.txId);
        // Get the new asset's information from the creator account
        const ptx = yield client.pendingTransactionInformation(tx.txId).do();
        assetID = ptx["asset-index"];
        // console.log("AssetID = " + assetID);
        yield printCreatedAsset(client, address, assetID);
        yield printAssetHolding(client, address, assetID);
        res.send("OK ok");
    }
    catch (e) {
        console.log("what");
        console.log(e);
    }
}));
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
app.post("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, algofile_1.createAccount)();
}));
//# sourceMappingURL=index.js.map