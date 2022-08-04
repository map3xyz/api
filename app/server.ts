import express from "express";
const app = express();
const router = express.Router();

router.get("/v1/dbversion", (req, res) => {
  res.status(200).json({ status: "/v1/dbversion - Not yet implemented" });
});

router.get("/v1/network", (req, res) => {
  res.status(200).json({ status: "/v1/network - Not yet implemented" });
});

router.get("/v1/network/:id", (req, res) => {
  res.status(200).json({ status: "/v1/network/:id - Not yet implemented" });
});

router.get("/v1/network/:networkId", (req, res) => {
  res
    .status(200)
    .json({ status: "/v1/network/:networkId - Not yet implemented" });
});

router.get("/v1/network/:networkId/asset/:assetId", (req, res) => {
  res.status(200).json({
    status: "/v1/network/:networkId/asset/:assetId - Not yet implemented",
  });
});

router.get("/v1/asset/:id", (req, res) => {
  res.status(200).json({
    status: "/v1/asset/:id - Not yet implemented",
  });
});

app.use("/api", router);

console.log("Starting API server on port: 3002");
app.listen(3002);
