import dotenv from "dotenv";
import express from "express";
import { getAssetById, getAssetByNetworkAndId } from "./api/asset";
import { getNetworkById, getNetworks } from "./api/network";

const app = express();
const router = express.Router();

dotenv.config();

router.get("/v1/network", async (req, res) => {
  return getNetworks(req, res);
});

router.get("/v1/network/:id", async (req, res) => {
  return getNetworkById(req, res);
});

router.get("/v1/network/:networkId/asset/:assetId", async (req, res) => {
  return getAssetByNetworkAndId(req, res);
});

router.get("/v1/asset/:id", async (req, res) => {
  return getAssetById(req, res);
});

app.use("/api", router);

console.log("Starting API server on port: 3002");
app.listen(3002);

