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


app.use(express.json());
//app.use(cors());

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

const axios = require('axios');
const qs = require('qs');

export let access_token = '';
export let refresh_token = '';

let data = qs.stringify({
    'grant_type': 'password',
    'username': process.env.keycloak_user_username,
    'password': process.env.keycloak_user_password,
    'client_id': process.env.client_id,
    'scope': 'openid',
    'client_secret': process.env.client_secret 
  });    
let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.keycloak_protocol +'://'+ process.env.keycloak_address + '/realms/gaia-x/protocol/openid-connect/token',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
    },
      data : data
};
    
axios.request(config)
.then((response) => {
    access_token = response.data.access_token;
    refresh_token = response.data.refresh_token;
    //console.log(JSON.stringify(response.data, null, 2));
    console.log(access_token);
    //console.log(refresh_token);
    //getToken(contractConfig.contractAddress,token_int_position)
})
.catch((error) => {
    console.log(error);
});

