import { Request, Response } from "express";
import { getConnection } from "../lib/db";

export async function getNetworks(req: Request, res: Response): Promise<void> {
  const db = await getConnection();

  const networks = await db.all("SELECT network_data FROM network");
  res.status(200).json(networks.map((network) => JSON.parse(network.network_data)));

  return Promise.resolve();
}

export async function getNetworkById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const db = await getConnection();

  const network = await db.get("SELECT network_data FROM network WHERE id=$id", { $id: id });
  if (network) {
    res.status(200).json(JSON.parse(network.network_data));
  } else {
    res.status(404);
  }

  return Promise.resolve();
}

