import dotenv from "dotenv";
dotenv.config();

const contractConfig = {
  rpcUrl: "https://rpc.ghostnet.teztnets.com/",
  contractAddress: process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS
    //: "KT1QzJR59dvx3pHaCgLUoffSTMKqqHZEYTkh",
    : "KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5",
};

export { contractConfig };