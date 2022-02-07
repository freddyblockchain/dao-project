
import { calculateState, Direction, Field } from './gameMethods';
import { parentPort, MessagePort } from 'worker_threads';
import {sleep} from 'sleep';
import { sendBackChoiceCoin } from './helper';
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import algosdk from "algosdk";

const getClient = () : AlgodClient => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
}
const client = getClient()

export type GameState = {
    counter: number,
    position: {x: number, y: number},
    field: Field,
    direction: Direction,
    aliceCount: number,
}

export let state: GameState =
{
    counter: 0,
    position: {x: 7, y: 7},
    field: Field.NOTHING,
    direction: Direction.STAY,
    aliceCount: 0,
}
parentPort.on('message', async (data) => {
    try{
        const { port }: { port: MessagePort} = data;
        while(1){
        sleep(10);
        state = await calculateState(state, client);
        await sendBackChoiceCoin(client);
        port.postMessage(state);
       }
    } catch(e){
    console.log(e);
   }
});
