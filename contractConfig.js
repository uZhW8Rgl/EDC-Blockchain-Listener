import dotenv from "dotenv";
dotenv.config();

const contractConfig = {
  rpcUrl: "https://rpc.ghostnet.teztnets.xyz/",
  adminAddress: process.env.ADMIN_ADDRESS
    ? process.env.ADMIN_ADDRESS
    : "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ",
  assetAddress: process.env.ASSET_ADDRESS
    ? process.env.ASSET_ADDRESS
    : "KT1CxCiasxvGijSvfRuNrss9TceNw8eHhd4R",
  policyAddress: process.env.POLICY_ADDRESS
    ? process.env.POLICY_ADDRESS
    : "KT1FM3F8EgfM3m2zjV66PPzs8vn5q9ZqpBad",
  contractAddress: process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS
    : "KT18pdEE9Jq4uWvBigLSefhwupB9TLuaM87K",
  transferAddress: process.env.TRANSFER_ADDRESS
    ? process.env.TRANSFER_ADDRESS
    : "KT18pEHAbmtGj9iYQAJNhN2CtzjBGf4zBxKX",
  agreementAddress: process.env.AGREEMENT_ADDRESS
    ? process.env.AGREEMENT_ADDRESS
    : "KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD",
  agreementLoggingAddress: process.env.AGREEMENT_LOGGING_ADDRESS
    ? process.env.AGREEMENT_LOGGING_ADDRESS
    : "KT1CHo3f2eWcnT7zCYs1KD1ERVXwEPYacj3A",
};

export { contractConfig };
