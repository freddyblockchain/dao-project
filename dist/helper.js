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
const algosdk_1 = require("algosdk");
const CHOICE_ASSET_ID = 21364625;
const validate_escrow_wallet = (address, _mnemonic, client) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, algosdk_1.isValidAddress)(address)) {
        return false;
    }
    if ((0, algosdk_1.mnemonicToSecretKey)(_mnemonic).addr != address) {
        return false;
    }
    if (!contains_choice_coin(address, client)) {
        return false;
    }
    if ((yield get_balance(address, client)) < 1000) {
        return false;
    }
    return true;
});
const get_balance = (address, client) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield client.accountInformation(address).do();
    return account.amount;
});
const contains_choice_coin = (address, client) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield client.accountInformation(address).do();
    const assets = account.assets;
    return assets.some(asset => asset.assetId === CHOICE_ASSET_ID);
});
//# sourceMappingURL=helper.js.map