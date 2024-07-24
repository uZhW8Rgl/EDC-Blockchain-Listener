import "./taquito/listener.js";
//import {getToken} from "./taquito/listener.js";

import { createRequire } from "module";
//import cors from 'cors';
const require = createRequire(import.meta.url);
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

//export 
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3005;

// Add this at the top of index.js
const logLevels = {
    'debug': 1,
    'info': 2,
    'warn': 3,
    'error': 4
};

export class Console {
    static log(message, level = 'debug') {
        if (logLevels[level] >= logLevels[process.env.LOG_LEVEL || 'info']) {
            console.log(`[${level.toUpperCase()}] [${new Date().toLocaleString()}] ${message}`);
        }
    }

    static debug(message) {
        this.log(message, 'debug');
    }

    static info(message) {
        this.log(message, 'info');
    }

    static warn(message) {
        this.log(message, 'warn');
    }

    static error(message) {
        this.log(message, 'error');
    }
}

app.use(express.json());
//app.use(cors());

app.post('/webhook', (req, res) => {
    Console.info('Webhook received:');
    Console.debug('Webhook body:', req.body);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
        }
    });
    res.sendStatus(200);
});

server.listen(port, () => Console.info('Server listening on port ' + port + '.'));



