import { Request, Response } from "express";
import { getConnection } from "../lib/db";

export async function queryNetworks(req: Request, res: Response): Promise<void> {
  const { id, network_code } = req.query;
  const db = await getConnection();
  let query: string;
  let params: any = {};

  if (id) {
    query = "SELECT network_data FROM network WHERE id=$id";
    params = { $id: id };
  } else if (network_code) {
    query = "SELECT network_data FROM network WHERE network_code=$network_code";
    params = { $network_code: network_code };
  } else {
    query = "SELECT network_data FROM network";
  }

  const networks = await db.all(query, params);
  res.status(200).json(networks.map((network) => JSON.parse(network.network_data)));

  return Promise.resolve();
}

