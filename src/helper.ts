
import JSONRequest from 'algosdk/dist/types/src/client/v2/jsonrequest';
import {Account, isValidAddress,makeAssetTransferTxnWithSuggestedParams,mnemonicToSecretKey, waitForConfirmation} from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { AssetHolding } from 'algosdk/dist/types/src/client/v2/algod/models/types';
const CHOICE_ASSET_ID = 67736927;


export const validate_escrow_wallet = async (address: string, _mnemonic:string, client: AlgodClient):Promise<Boolean> => {

    try{

    if (!isValidAddress(address)){
        return false;
    }

    if (mnemonicToSecretKey(_mnemonic).addr != address){
        console.log("wrong address!")
        return false
    }

    if  (!contains_choice_coin(address, client)){
        console.log("no choice coin ");
        return false
    }

    if (await get_balance(address, client) < 1000){
        console.log(await get_balance(address, client))
        return false;
    }
    return true;

    }catch(e){
      console.log(e)
    }

}


const get_balance = async (address: string, client: AlgodClient): Promise<number> => {
    const account = await client.accountInformation(address).do();
    return account.amount;
}


const contains_choice_coin = async (address: string, client: AlgodClient):Promise<Boolean> => {
    try{
    const account = await client.accountInformation(address).do();

    const assets:AssetHolding[] = account.assets;
    return assets.some(asset => asset.assetId === CHOICE_ASSET_ID);
    }catch(e){
        console.log(e)
    }
}

export const sendChoiceCoin = async (sendingAccount: Account, receivingAddress: string, client: AlgodClient) => {
    // Transfer New Asset:
// Now that account3 can recieve the new tokens
// we can tranfer tokens in from the creator
// to account3
const revocationTarget:any = undefined;
const closeRemainderTo:any = undefined;
const note:any = undefined;
const params = await client.getTransactionParams().do();
// Amount of the asset to transfer
const amount = 1;

// signing and sending "txn" will send "amount" assets from "sender" to "recipient"
const xtxn = makeAssetTransferTxnWithSuggestedParams(sendingAccount.addr, receivingAddress, closeRemainderTo, revocationTarget,
        amount,  note, CHOICE_ASSET_ID, params);
// Must be signed by the account sending the asset
const rawSignedTxn = xtxn.signTxn(sendingAccount.sk);
const xtx = (await client.sendRawTransaction(rawSignedTxn).do());
console.log("Transaction : " + xtx.txId);
// wait for transaction to be confirmed
await waitForConfirmation(client, xtx.txId, 1000);
}
