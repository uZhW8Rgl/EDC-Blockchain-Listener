import express from "express";
import dotenv from "dotenv";
import "./taquito/listener.js";
import "./server.js";

// set up express
const client = express();
client.use(express.json());
const port = 3001;

dotenv.config();

// Swagger Setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tezos Client for Listening to Contracts",
    version: "1.0.0",
    description:
      "Interface to forward changes to Assets, Policies and Contracts from Eclipse Dataspace Connector to the Federated Catalog.",
  },
  servers: [
    { url: "http://" + "localhost" + ":" + port, description: "Dev Server" },
  ],
};

client.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  //console.log(`For API Documentation see http://localhost:${port}/docs`);
});
