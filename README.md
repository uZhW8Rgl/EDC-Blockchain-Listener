# EDC-Blockchain-Listener

## Listener Setup

Ensure that [./contractConfig.js](./contractConfig.js) has the actual addresses and that the right address is in the destination of the [./taquito/listener.js](./taquito/listener.js).

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

