import express from "express";
import { queryAssets } from "./api/asset";
import { queryNetworks } from "./api/network";
import { getConnection } from "./lib/db";
import { log } from "./lib/telemetry";
import { SERVER_PORT } from "./util/config";

const app = express();
const router = express.Router();

router.get("/v1/network", async (req, res) => {
  return queryNetworks(req, res);
});

router.get("/v1/asset", async (req, res) => {
  return queryAssets(req, res);
});

app.use("/", router);

getConnection()
  .then((db) => {
    console.log("Starting API server on port: " + SERVER_PORT);
    app.listen(SERVER_PORT, "127.0.0.1");
    log("start");
  })
  .catch((err: any) => {
    console.error("Error starting API server. Possibly failed to find Db Location");
    console.error(err);
    process.exit(1);
  });

