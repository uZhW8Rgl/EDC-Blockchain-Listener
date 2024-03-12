import { TezosToolkit } from "@taquito/taquito";
import { contractConfig } from "../contractConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// connect tezos client to testnet
const tezos = new TezosToolkit(contractConfig.rpcUrl);

// webhook
const axios = require('axios');
//const webhookURL = 'https://webhook.site/a2c92283-f097-4a4a-805e-9371ccd77ef9'
const webhookURL = 'http://localhost:3005/webhook'


// monitor contract definitions for entrypoint calls to mint
tezos.setProvider({ 
  config: { shouldObservableSubscriptionRetry: true, streamerPollingIntervalMilliseconds: 1500 } 
});
  
try {
  const sub = tezos.stream.subscribeOperation({
    destination: contractConfig.contractAddress
  });
   
  sub.on('data', function(data) {
    if(data?.parameters?.entrypoint === 'mint') {
      console.log('Change on monitored contract detected! Please visit: https://better-call.dev/ghostnet/' + contractConfig.contractAddress + '/tokens');
      console.log(data);
      axios.post(webhookURL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Status:', response.status);
        console.log('Body: ', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
  
} catch (e) {
  console.log(e);
};
  
function consoleMessage() {
  console.log('Change on monitored contract detected! Please visit: https://better-call.dev/ghostnet/' + contractConfig.contractAddress + '/tokens');
}