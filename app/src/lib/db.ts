import { readFile } from "node:fs/promises";
import { PromisedDatabase } from "promised-sqlite3";

export async function getConnection(
  assetDbDir: string = process.env.ASSET_DB_DIR as string
): Promise<PromisedDatabase> {
  const filename = await getDbLocation(assetDbDir);

  const db = new PromisedDatabase();
  await db.open(filename);

  return Promise.resolve(db);
}

async function getDbLocation(assetDbDir: string): Promise<string> {
  const filename = await readFile(`${assetDbDir}/LATEST_ID`);
  return Promise.resolve(assetDbDir + "/" + filename.toLocaleString());
}

