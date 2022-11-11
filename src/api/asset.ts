import { Request, Response } from "express";
import { getConnection } from "../lib/db";
import { formatMapsResponse } from "../lib/maps";

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

  query = `
  with recursive maps as (
    select 
      id, 
      null as mapped 
    from 
      asset 
    where 
      id = $id 
    union 
    select 
      n.id, 
      case when e.to_id = n.id then e.from_id else e.to_id end as mapped 
    from 
      maps n 
      join asset_map e on n.id = e.from_id 
      OR n.id = e.to_id
  ) 
  select 
    address, 
    network_code as networkCode 
  from 
    maps, 
    asset 
  where 
    mapped is not null 
    and asset.id = maps.mapped
  `;
  params = { $id: id };

  const maps = await db.all(query, params);

  if(maps && maps.length > 0) {
    asset.asset_data = formatMapsResponse(asset.asset_data, maps);
  }

  res.status(200).json(asset.asset_data);

  return Promise.resolve();
}

