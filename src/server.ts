import dotenv from "dotenv";
import express from "express";
import { queryAssets } from "./api/asset";
import { queryNetworks } from "./api/network";
import { track } from '@map3xyz/telemetry';
import os from 'os';
import { getUUID } from "./util/uuid";
import { SERVER_PORT } from "./util/config";
import { getConnection } from "./lib/db";

const app = express();
const router = express.Router();

dotenv.config();

router.get("/v1/network", async (req, res) => {
  return queryNetworks(req, res);
});

router.get("/v1/asset", async (req, res) => {
  return queryAssets(req, res);
});

app.use("/", router);

getConnection()
  .then(db => {
    console.log("Starting API server on port: " + (SERVER_PORT));
    app.listen(SERVER_PORT, "127.0.0.1");

    track('api', 'oss', 'start', os.version(), getUUID());
  }).catch((err: any) => {
    console.error('Error starting API server. Possibly failed to find Db Location');
    console.error(err); 
    process.exit(1)
  });
