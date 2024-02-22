import { TezosToolkit } from "@taquito/taquito";
import { contractConfig } from "../contractConfig.js";

// connect tezos client to testnet
const tezos = new TezosToolkit(contractConfig.rpcUrl);

// monitor contract definitions for entrypoint calls to mint
tezos.setProvider({ 
  config: { shouldObservableSubscriptionRetry: true, streamerPollingIntervalMilliseconds: 1500 } 
});
  
try {
  const sub = tezos.stream.subscribeOperation({
    destination: contractConfig.verifiableCredentialsAddress
  });
   
  sub.on('data', function(data) {
    if(data?.parameters?.entrypoint === 'mint') {
      myFunction();

    }
  });
  
} catch (e) {
  console.log(e);
};
  
function myFunction() {
  console.log('Change on monitored contract detected! Please visit: https://better-call.dev/ghostnet/' + contractConfig.verifiableCredentialsAddress + '/tokens');
}