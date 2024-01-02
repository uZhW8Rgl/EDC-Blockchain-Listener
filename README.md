# EDC-Blockchain-Listener

## IPFS Setup

In order to pin content to the IPFS you must include your Pinata API credentials in the form of environment parameters:

1. Create a file in root directory called ".env"
2. Add your [Pinata key](https://knowledge.pinata.cloud/en/articles/6191471-how-to-create-an-pinata-api-key) as a variable (the JWT key):
   ```
   PINATA_KEY="<JWT key>"
   ```
3. Optionally: Add your own smart contract addresses as env variables
   - ASSET_ADDRESS
   - POLICY_ADDRESS
   - CONTRACT_ADDRESS
   - TRANSFER_ADDRESS
   - AGREEMENT_ADDRESS

## Run the Tezos Client

First, make sure all dependencies are installed:

```
npm install
```

Run the server locally:

```
npm run serve
```

## Swagger Documentation

The documentation can be viewed on http://localhost:3000/docs when server runs.

## Contract Information

Metadata of FA2 contracts is generated with the support of @taqueria/plugin-metadata feature to comply with TZIP-16 standard.

## Tezos Account

Feel free to use the current tezos account included in [./.taq/config.json](./.taq/config.json) for testing.

You can easily create your own account and change it in the config file.

When originating new contracts, make sure to update the new addresses in [./contractConfig.js](./contractConfig.js).

