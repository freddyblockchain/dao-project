
import JSONRequest from 'algosdk/dist/types/src/client/v2/jsonrequest';
import {Account, isValidAddress,makeAssetTransferTxnWithSuggestedParams,mnemonicToSecretKey, waitForConfirmation} from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { AssetHolding } from 'algosdk/dist/types/src/client/v2/algod/models/types';
import { Direction } from './gameMethods';
const CHOICE_ASSET_ID = 67736927;

export const upAddress = '76YMRPUDAXVBVTIXWZUSBXN5QZ4AGM5ETMQZ3U2GWIBSNFVM76RO6CJ56E';
export const rightAddress = 'FSYAIAXBFBMPWSYRUHYIIPLT62T3EEZSBTSNI7YTOPZRRBHIIIDSBOAUAU';
export const downAddress = 'EWRD4DEN63AXZE4ATFUULAJVRCVPVCIGXARI2O2NMU7FMJ7ABPAFTF22MI';
export const leftAddress = 'GK2P7BCBCZ4L4P7GGPKL6VE3JHGAV473FP2R2MQKS6GUZ2SODC3TIGL4NA';

const upMnemonic = "trophy absorb slender alien rib stairs need welcome symbol text wait cluster water finger moral decide nephew party toddler fee square motor empower abstract trophy";
const rightMnemonic = "drill mask govern private company pupil rigid bus casual garden enemy awful family horn unfair injury outdoor point apology robust access solid tumble ability fever";
const downMnemonic = "hunt little small electric sugar item divide frost labor define ice fit speak spider fluid cancel industry catalog series mesh arena royal can able water";
const leftMnemonic = "kitchen loan flame firm what inhale property afraid stumble spend dance echo slim setup core impose typical try hope country enough stand recycle above explain";

const mainAddress = "OI6YO7U7JRE2CWEOALW3HRHAT7S364ZCFW2E2SS4I3B3BIUSUVPRJI7VRY";

let uniqueCounter = 0;

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

export const choiceCoinBalance = async (address: string, client: AlgodClient): Promise<number> => {
    const account = await client.accountInformation(address).do();
    // console.log(account);
    const assets = account.assets;

    const asset: { 'asset-id': number, amount: number;} =
    assets.find(((asset: { 'asset-id': number, amount: number; }) => asset['asset-id'] === CHOICE_ASSET_ID));

    return asset ? asset.amount : 0;
}


const sendBackChoiceCoinForWallet = async (address: string, client: AlgodClient, mmemonic: string) => {
    const balance = await choiceCoinBalance(address,client);
    if(balance > 0){
        console.log(" sending back " + balance + "choice coins " )
        const account = mnemonicToSecretKey(mmemonic);
        await sendChoiceCoin(account, client, mainAddress, balance as number);
        const afterSending = await choiceCoinBalance(address,client);
        console.log(" balance after sending choice coin: " + afterSending);

    }
}

export const sendBackChoiceCoin = async (client: AlgodClient) => {
    await sendBackChoiceCoinForWallet(upAddress,client,upMnemonic);
    await sendBackChoiceCoinForWallet(rightAddress,client,rightMnemonic)
    await sendBackChoiceCoinForWallet(downAddress,client,downMnemonic)
    await sendBackChoiceCoinForWallet(leftAddress,client,leftMnemonic);
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

export const getReceivingChoiceCoinAddress = (direction: Direction): string => {
        switch(direction){
            case Direction.UP:
                return upAddress;
            case Direction.RIGHT:
                return rightAddress;
            case Direction.DOWN:
                return downAddress ;
            case Direction.LEFT:
                return leftAddress;
        }
        return '';
    }

export const sendChoiceCoin = async (sendingAccount: Account,client: AlgodClient, receivingAddress: string, amount: number = 1) => {
    // Transfer New Asset:
// Now that account3 can recieve the new tokens
// we can tranfer tokens in from the creator
// to account3
const revocationTarget:any = undefined;
const closeRemainderTo:any = undefined;

const note:Uint8Array = new TextEncoder().encode(new Date().toString() + uniqueCounter);
const params = await client.getTransactionParams().do();
// Amount of the asset to transfer
uniqueCounter++;

// signing and sending "txn" will send "amount" assets from "sender" to "recipient"
const xtxn = makeAssetTransferTxnWithSuggestedParams(sendingAccount.addr, receivingAddress, closeRemainderTo, revocationTarget,
        amount,  note, CHOICE_ASSET_ID, params);
// Must be signed by the account sending the asset
const rawSignedTxn = xtxn.signTxn(sendingAccount.sk);
const xtx = await client.sendRawTransaction(rawSignedTxn).do();
console.log("dosn't go here");
console.log("Transaction : " + xtx.txId);
// wait for transaction to be confirmed
}
