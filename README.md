# EDC-Blockchain-Listener

The listener observes if the mint function of a smart contract is triggered. If so, it forwards a JSON to a WebSocket server that notifies the subscribed clients and relays the JSON.

## Interface
### Handling verifiablePresentation
- If `res[0].metadata.tokenData.verifiablePresentation` exists the ContractListener component signed claims and stored them in the field `verifiablePresentation`. 
- The `verifiablePresentation` is a JSON object that contains the signed claims and is sent to the catalogue as it is.

### Handling claimComplianceServiceResponses
- If `claimComplianceProviderResponses` exists the ContractListener component collected all `claimComplianceProviderResponse` fields from all associated assets and stored them in the json array `claimComplianceProviderResponses`.
- Each array item is decoded and parsed into json.
- This json array represents the response from the [Claim Compliance Provider](https://claim-compliance-provider.gxfs.gx4fm.org/docs/)'s `send-claims` endpoint.
- Each contained Verifiable Presentation which Verifiable Credential is not issued by `did:web:compliance.lab.gaia-x.eu*` is sent to the catalogue as it is.

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

