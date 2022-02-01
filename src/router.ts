import {app} from '../src/index';
import {spawn} from 'child_process';
import path from 'path';
import { Worker, MessageChannel } from 'worker_threads';
const worker = new Worker('../dist/resultWorker.js');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => {
 console.log('message from worker:', message);
});

worker.postMessage({ port: port2 }, [port2]);

app.get( "/data", ( req, res ) => {
    return res.send("ok");
} );