import express from "express";
import algosdk from "algosdk";
import { INVALID_MSIG_VERSION_ERROR_MSG } from "algosdk/dist/types/src/encoding/address";
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import { validate_escrow_wallet } from "./helper";
import { createAccount } from "./algofile";
const app = express();
const port = 8080; // default port to listen

const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.post( "/validateWallet", async ( req, res ) => {
    try{
    const body = req.body
    console.log(req.body)
    const client = getClient()
    const validateResult = await validate_escrow_wallet(body.address as string,body.mmenonic as string, client);
    res.send( "Hello world!" + "address is: " + body.address + " mmenonic is " + body.mmenonic + "is it valid " + validateResult);
    }catch(e){

    }
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

const getClient = ():AlgodClient => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
}

app.post("/createAccount", async(req,res) => {
    createAccount()
});