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
      "AND ass.network_code = net.network_code " +
      "AND ass.address = $address";
    params = { $network_code: network_code, $address: address };
  } else {
    res.status(400);
    res.json({ error: "id or network_code and address must be specified when querying assets" });
    return Promise.resolve();
  }

  const asset = await db.get(query, params);

  if(!asset) {
    res.status(404).end();
  }

  asset.asset_data = JSON.parse(asset.asset_data);

  query = "SELECT * FROM asset_map WHERE to_network=$to_network AND to_address=$to_address";
  params = { $to_network: asset.asset_data.networkCode, $to_address: asset.asset_data.address };

  const maps = await db.all(query, params);

  if(maps && maps.length > 0) {
    const networkCodes = [...new Set(maps.map((map: any) => map.from_network))].sort();
    const networks: {[networkCode: string]: string[]} = {};

    for(const networkCode of networkCodes) {
      const networkAddresses = maps
        .filter((map: any) => map.from_network === networkCode)
        .map((map: any) => map.from_address);

      networks[networkCode + ''] = networkAddresses;
    }
    asset.asset_data.networks = networks;

    const types = [...new Set(maps.map((map: any) => map.type))].sort();
    const organizedMaps: {[type: string]: any[]} = {};

    for(const type of types) {
      const typeMaps = maps
        .filter((map: any) => map.type === type)
        .map((map: any) => JSON.parse(map.data));

      organizedMaps[type + ''] = typeMaps;
    }
    asset.asset_data.maps = organizedMaps; 
  }

  res.status(200).json(asset.asset_data);

  return Promise.resolve();
}

