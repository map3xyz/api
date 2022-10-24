import { Request, Response } from "express";
import { getConnection } from "../lib/db";

export async function queryStats(req: Request, res: Response): Promise<void> {
  const db = await getConnection();

  const assets = await db.get('SELECT COUNT(*) FROM asset');

  const networks = await db.get('SELECT COUNT(*) FROM network');

  const networksWithAssets = await db.all('SELECT network_data from network where network_code in (SELECT distinct n.network_code FROM asset a, network n WHERE address IS NOT NULL AND a.network_id = n.id)');

  const stats = {
    assets,
    networks,
    networksWithAssets
  };

  res.status(200).json(stats);

  return Promise.resolve();
}

