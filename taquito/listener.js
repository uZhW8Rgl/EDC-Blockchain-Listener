import { TezosToolkit } from "@taquito/taquito";
import { contractConfig } from "../contractConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { access_token } from "../index.js";


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
   
let tokenIDs = new Set();

try {
  const sub = tezos.stream.subscribeOperation({
    destination: contractConfig.contractAddress
  });
   
  sub.on('data', function(data) {
    if(data?.parameters?.entrypoint === 'mint') {
      console.log('Change on monitored contract detected! Please visit: https://better-call.dev/ghostnet/' + contractConfig.contractAddress + '/tokens');
      console.log(data);
      console.log(JSON.stringify(data, null, 2));
      const token_int_position = data.metadata.operation_result.lazy_storage_diff[2].diff.updates[0].key.int // get token id
      //console.log(JSON.stringify(tokenint, null, 2));
      if(tokenIDs.has(token_int_position)) {
        return; // Wenn ja, ignorieren wir sie
      }
      tokenIDs.add(token_int_position);
      console.log(token_int_position);
      
      getToken(contractConfig.contractAddress,token_int_position) // get token metadata
      
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

export const getToken = async (contractAddress, tokenCount) => {
  let result = [];
  let startTime = new Date().getTime();

  const recursiveCall = async () => {
    let request = {
      method: "get",
      url: `https://api.ghostnet.tzkt.io/v1/tokens/`,
      params: {
        contract: contractAddress,
        tokenId: tokenCount
      },
    };
    await axios(request)
    .then((response) => {
      let res = response.data;
      console.log(JSON.stringify(res, null, 2))
      result.push(res);
      if (res[0] && res[0].metadata && res[0].metadata.tokenData && res[0].metadata.tokenData.verifiablePresentation) {
        tokenIDs.delete(tokenCount);
        console.log('Metadata found');
        console.log(JSON.stringify(res[0].metadata.tokenData.verifiablePresentation, null, 2))
        forwardToken(res[0].metadata.tokenData.verifiablePresentation); // forward verifiable presentation of token to Federated Catalog server
      } else {
        setTimeout(() => {
          recursiveCall();
        }, 1*60*1000);
      }
    })
    .catch(function (error) {
      console.log(error);
      throw new Error(error);
    });
  };

  await recursiveCall();

  let endtime = new Date().getTime();
  let duration = (endtime - startTime) / 1000;
  console.log(`Execution time: ${duration} seconds`);
  console.log(`${result.length} tokens were returned`);
};

const forwardToken = async (token) => {
  
  let data = token;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://fc-server.gxfs.gx4fm.org/self-descriptions',
    headers: { 
      'accept': 'application/json', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + access_token
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
}