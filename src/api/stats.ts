import { Request, Response } from "express";
import { getConnection } from "../lib/db";

const sdkNetworkCodes = [
    'bitcoin',
    'solana',
    'near',
    'tezos',
    'algorand'
]

const keychainNetworkCodes = [
    'bitcoin'
]

export async function queryStats(req: Request, res: Response): Promise<void> {
  const db = await getConnection();

  const assets = await db.get('SELECT COUNT(*) FROM asset');

  let networks = await db.all('SELECT * FROM network');

  let networksWithAssets = await db.all('SELECT distinct n.network_code FROM asset a, network n WHERE address IS NOT NULL AND a.network_code = n.network_code');

  networksWithAssets = networksWithAssets.map((network) => network.network_code);

  networks = networks.map(network => {
    const network_data = JSON.parse(network.network_data);
    return {
        name: network_data.name,
        network_code: network.network_code,
        features: {
            assets: networksWithAssets.some(n => n === network.network_code),
            sdk: network_data.identifiers?.chainId !== undefined || sdkNetworkCodes.some((n) => n === network.network_code),
            keyChain: network_data.identifiers?.chainId !== undefined || keychainNetworkCodes.some((n) => n === network.network_code)
        },
        identifiers: network_data.identifiers
    }
  });

  const stats = {
    assets: Object.values(assets)[0],
    networks: networks
  };

  res.status(200).json(stats);

  return Promise.resolve();
}

