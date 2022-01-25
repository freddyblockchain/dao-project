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
exports.validate_escrow_wallet = void 0;
const algosdk_1 = require("algosdk");
const CHOICE_ASSET_ID = 66923550;
const validate_escrow_wallet = (address, _mnemonic, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, algosdk_1.isValidAddress)(address)) {
            return false;
        }
        if ((0, algosdk_1.mnemonicToSecretKey)(_mnemonic).addr != address) {
            console.log("wrong address!");
            return false;
        }
        if (!contains_choice_coin(address, client)) {
            console.log("no choice coin ");
            return false;
        }
        if ((yield get_balance(address, client)) < 1000) {
            console.log(yield get_balance(address, client));
            return false;
        }
        return true;
    }
    catch (e) {
        console.log(e);
    }
});
exports.validate_escrow_wallet = validate_escrow_wallet;
const get_balance = (address, client) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield client.accountInformation(address).do();
    return account.amount;
});
const contains_choice_coin = (address, client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield client.accountInformation(address).do();
        const assets = account.assets;
        return assets.some(asset => asset.assetId === CHOICE_ASSET_ID);
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=helper.js.map