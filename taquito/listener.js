import { TezosToolkit } from "@taquito/taquito";
import { contractConfig } from "../contractConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { access_token } from "../index.js";
import { Buffer } from "buffer";

const logLevels = {
  'debug': 1,
  'info': 2,
  'warn': 3,
  'error': 4
};

class Console {
  static log(message, level = 'debug') {
    if (logLevels[level] >= logLevels[currentLogLevel]) {
      console.log(`[${level.toUpperCase()}] ${message}`);
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

const currentLogLevel = process.env.LOG_LEVEL || 'info';

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
      Console.info('Change on monitored contract detected! Please visit: https://better-call.dev/ghostnet/' + contractConfig.contractAddress + '/tokens');
      Console.debug(JSON.stringify(data, null, 2));
      const token_int_position = data.metadata.operation_result.lazy_storage_diff[2].diff.updates[0].key.int // get token id
      if(tokenIDs.has(token_int_position)) {
        return; // Wenn ja, ignorieren wir sie
      }
      tokenIDs.add(token_int_position);
      Console.info(token_int_position);
      
      getToken(contractConfig.contractAddress,token_int_position) // get token metadata
      
      axios.post(webhookURL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        Console.info('Status:', response.status);
        Console.info('Body: ', response.data);
      })
      .catch(error => {
        Console.error('Error:', error);
      });
    }
  }); 
  
} catch (e) {
  Console.error('Error: ', e);
}

export const getToken = async (contractAddress, tokenCount) => {
  let result = [];
  let startTime = new Date().getTime();
  let recursiveCallsCount = 0; // Initialize counter

  const recursiveCall = async () => {
    recursiveCallsCount++; // Increment counter at the beginning of each call
    if (recursiveCallsCount > 3) {
      Console.info('Maximum recursive calls reached.');
      return; // Stop recursion if counter is greater than 3
    }    
    
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
      Console.debug(JSON.stringify(res, null, 2))
      result.push(res);
      if (res[0] && res[0].metadata && res[0].metadata.tokenData && res[0].metadata.tokenData.verifiablePresentation) {
        processVerifiablePresentation(res, tokenCount);
      } else if (res[0] && res[0].metadata && res[0].metadata.tokenData && res[0].metadata.tokenData.claimComplianceProviderResponses) {
        processClaimComplianceProviderResponses(res, tokenCount);
      }
      else {
        Console.info('No metadata found');
        setTimeout(() => {
          recursiveCall();
        }, 1*60*1000);
      }
    })
    .catch(function (error) {
      Console.info(error);
      throw new Error(error);
    });
  };

  await recursiveCall();

  let endtime = new Date().getTime();
  let duration = (endtime - startTime) / 1000;
  Console.info(`Execution time: ${duration} seconds`);
  Console.info(`${result.length} tokens were returned`);
};

// Moved to top level with necessary parameters
const processVerifiablePresentation = (res, tokenCount) => {
  tokenIDs.delete(tokenCount);
  Console.info('Metadata for "verifiablePresentation" found');
  Console.debug(JSON.stringify(res[0].metadata.tokenData.verifiablePresentation, null, 2))
  forwardToken(res[0].metadata.tokenData.verifiablePresentation); // forward verifiable presentation of token to Federated Catalog server
};

// Moved to top level with necessary parameters
const processClaimComplianceProviderResponses = (res, tokenCount) => {
  tokenIDs.delete(tokenCount);
  Console.info('Metadata for "claimComplianceProviderResponses" found');
  Console.debug(JSON.stringify(res[0].metadata.tokenData.claimComplianceProviderResponses, null, 2))

  const claimComplianceProviderResponses = res[0].metadata.tokenData.claimComplianceProviderResponses;
  claimComplianceProviderResponses.forEach(response => {
    const decodedString = Buffer.from(response, 'base64').toString('utf-8');
    const jsonArray = JSON.parse(decodedString);
    jsonArray.forEach(item => {
      if (item.verifiableCredential[0].verificationMethod.startsWith("did:web:compliance.lab.gaia-x.eu")) {
        Console.info("Skipping forwardToken due to verificationMethod starts with did:web:compliance.lab.gaia-x.eu.");
      } else {
        Console.info("Sending VP to FC server");
        forwardToken(item);
      }
    });
  });
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
    Console.info('Status of FC response:', response.status);
    Console.debug(JSON.stringify(response.data));
  })
  .catch((error) => {
    Console.info('Status of FC response:', response.status);
    Console.info(error);
  });
}