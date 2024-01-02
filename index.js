import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getBalanceRoute } from "./routes/balance.js";
import { getLogRoute } from "./routes/tezos_ednpoints.js";
import dotenv from "dotenv";

// set up express
const client = express();
client.use(express.json());
const port = 3001;

dotenv.config();

// Load speficig endspoints
getBalanceRoute(client);
getLogRoute(client);

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
    { url: "http://" + "localhost" + ":3001", description: "Dev Server" },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
client.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

client.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  console.log(`For API Documentation see http://localhost:${port}/docs`);
});
