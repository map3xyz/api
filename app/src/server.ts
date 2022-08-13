import dotenv from "dotenv";
import express from "express";
import { queryAssets } from "./api/asset";
import { queryNetworks } from "./api/network";

const app = express();
const router = express.Router();

dotenv.config();

router.get("/v1/network", async (req, res) => {
  return queryNetworks(req, res);
});

router.get("/v1/asset", async (req, res) => {
  return queryAssets(req, res);
});

app.use("/api", router);

console.log("Starting API server on port: 3002");
app.listen(3002);

