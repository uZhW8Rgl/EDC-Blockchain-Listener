// catalogue.js
import axios from 'axios';
import qs from 'qs';
import { Console } from "../index.js";

export let access_token = '';
export let refresh_token = '';

export const sendToCatalogue = async (token) => {
    let attemptRefresh = true;

    const sendRequest = async () => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://fc-server.gxfs.gx4fm.org/self-descriptions',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
            data: token
        };

        try {
            const response = await axios.request(config);
            Console.info('Status of FC response: ' + response.status);
            Console.debug(JSON.stringify(response.data));
        } catch (error) {
            if (error.response && error.response.status === 401 && attemptRefresh) {
                Console.info('Access token expired. Refreshing token...');
                await refreshAccessToken();
                attemptRefresh = false;
                await sendRequest();
            } else {
                let statusCode = error.response ? error.response.status : 'No response';
                Console.info('Status of FC response: ' + statusCode);
                Console.error(error);
            }
        }
    };

    await sendRequest();
};

const refreshAccessToken = async () => {
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

// initialize the access token on startup
(async () => {
    await refreshAccessToken();
})();
