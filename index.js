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

class Console {
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

// Export the Console class
export { Console };

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

const axios = require('axios');
const qs = require('qs');

export let access_token = '';
export let refresh_token = '';

export const refreshAccessToken = async () => {
    let data;
    if (refresh_token) {
        data = qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': process.env.client_id,
            'client_secret': process.env.client_secret
        });
    } else {
        data = qs.stringify({
            'grant_type': 'password',
            'username': process.env.keycloak_user_username,
            'password': process.env.keycloak_user_password,
            'client_id': process.env.client_id,
            'scope': 'openid',
            'client_secret': process.env.client_secret
        });
    }
    let config = {
        method: 'post',
        url: process.env.keycloak_protocol + '://' + process.env.keycloak_address + '/realms/gaia-x/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        access_token = response.data.access_token; // Update the global access_token
        refresh_token = response.data.refresh_token; // Optionally update the refresh_token if it's also refreshed
        Console.info("Access token refreshed.");
    } catch (error) {
        Console.error("Failed to refresh access token: " + error);
    }
};

