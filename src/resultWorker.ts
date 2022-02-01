import { parentPort, MessagePort } from 'worker_threads';
import {sleep} from 'sleep';
parentPort.on('message', (data) => {
    const { port }: { port: MessagePort } = data;
    let counter = 0;
    while(1){
    sleep(4);
    port.postMessage('heres your message!' + counter);
    counter++;
    }
   });
