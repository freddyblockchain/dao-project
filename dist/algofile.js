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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const { mnemonicToMasterDerivationKey } = require('algosdk');
const algosdk = require('algosdk');
const createAccount = function () {
    try {
        console.log("whaaat");
        const myaccount = algosdk.generateAccount();
        console.log("Account Address = " + myaccount.addr);
        const account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Account Mnemonic = " + account_mnemonic);
        console.log("Account created. Save off Mnemonic and address");
        console.log("Add funds to account using the TestNet Dispenser: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");
        return myaccount;
    }
    catch (err) {
        console.log("err", err);
    }
};
exports.createAccount = createAccount;
function firstTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            const algodServer = 'http://localhost';
            const algodPort = 4001;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        }
        catch (err) {
            console.log("err", err);
        }
    });
}
// createAccount();
//# sourceMappingURL=algofile.js.map