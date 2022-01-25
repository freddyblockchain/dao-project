
import JSONRequest from 'algosdk/dist/types/src/client/v2/jsonrequest';
import {isValidAddress,mnemonicToSecretKey} from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { AssetHolding } from 'algosdk/dist/types/src/client/v2/algod/models/types';
const CHOICE_ASSET_ID = 66923550


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
