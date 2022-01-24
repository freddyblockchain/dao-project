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
const app = (0, express_1.default)();
const port = 8080; // default port to listen
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.post("/validateWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        console.log(req.body);
        const client = getClient();
        const validateResult = yield (0, helper_1.validate_escrow_wallet)(body.address, body.mmenonic, client);
        res.send("Hello world!" + "address is: " + body.address + " mmenonic is " + body.mmenonic + "is it valid " + validateResult);
    }
    catch (e) {
    }
}));
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
const getClient = () => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = 4001;
    return new algosdk_1.default.Algodv2(algodToken, algodServer, algodPort);
};
app.post("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, algofile_1.createAccount)();
}));
//# sourceMappingURL=index.js.map