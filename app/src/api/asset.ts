import { Request, Response } from "express";
import { getConnection } from "../lib/db";

export async function getAssetById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const db = await getConnection();

  const asset = await db.get("SELECT asset_data FROM asset WHERE id=$id", {
    $id: id,
  });

  if (asset) {
    res.status(200).json(JSON.parse(asset.asset_data));
  } else {
    res.status(404);
  }

  return Promise.resolve();
}

export async function getAssetByNetworkAndId(req: Request, res: Response): Promise<void> {
  const { networkId, assetId } = req.params;
  const db = await getConnection();

  const asset = await db.get("SELECT asset_data FROM asset WHERE network_id=$network_id AND id=$asset_id", {
    $network_id: networkId,
    $asset_id: assetId,
  });

  if (asset) {
    res.status(200).json(JSON.parse(asset.asset_data));
  } else {
    res.status(404);
  }

  return Promise.resolve();
}

