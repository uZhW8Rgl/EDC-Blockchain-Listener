import "./taquito/listener.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3005;


app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
        }
    });
    res.sendStatus(200);
});

server.listen(port, () => console.log('Server listening on port ' + port + '.'));