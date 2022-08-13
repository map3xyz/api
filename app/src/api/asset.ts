import { Request, Response } from "express";
import { getConnection } from "../lib/db";

export async function queryAssets(req: Request, res: Response): Promise<void> {
  const { id, network_code, address } = req.query;
  const db = await getConnection();
  let query: string;
  let params: any = {};

  if (id) {
    query = "SELECT asset_data FROM asset WHERE id=$id";
    params = { $id: id };
  } else if (network_code && address) {
    query =
      "SELECT asset_data FROM asset ass, network net " +
      "WHERE net.network_code=$network_code " +
      "AND ass.network_id = net.id " +
      "AND ass.address = $address";
    params = { $network_code: network_code, $address: address };
  } else {
    res.status(400);
    res.json({ error: "id or network_code and address must be specified when querying assets" });
    return Promise.resolve();
  }

  const assets = await db.all(query, params);
  res.status(200).json(assets.map((asset) => JSON.parse(asset.asset_data)));

  return Promise.resolve();
}

