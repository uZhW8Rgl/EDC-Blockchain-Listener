# EDC-Blockchain-Listener

The listener observes if the mint function of a smart contract is triggered. If so, it forwards a JSON to a WebSocket server that notifies the subscribed clients and relays the JSON.

## Listener Setup

Ensure that [./contractConfig.js](./contractConfig.js) has the actual addresses and that the right address is in the destination of the [./taquito/listener.js](./taquito/listener.js) or if you are using docker look out that the correct environment variable is set.

## Run the Tezos Client

First, make sure all dependencies are installed:

```
npm install
```

Run the server locally:

```
npm run serve
```


## Tezos Account

You can easily create your own account and change it in the config file.

When originating new contracts, make sure to update the new addresses in [./contractConfig.js](./contractConfig.js).

