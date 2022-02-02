import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import algosdk from 'algosdk';
const getClient = () : AlgodClient => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
}
export const client = getClient();