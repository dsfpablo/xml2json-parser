import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { cronTasks } from "./lib/crons";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { connectToDatabase } from "./database/connect";
import { populateVehicles } from "./controllers/vehicleController";

dotenv.config();

(async () => {
  await connectToDatabase();
  populateVehicles();
  cronTasks();

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });
  await server.start();

  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

  const APP_PORT = process.env.APP_PORT || 3000;
  httpServer.listen({ port: APP_PORT }, () => console.log(`Server running at http://localhost:${APP_PORT}/graphql`));
})();
