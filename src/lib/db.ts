import { readFile } from "node:fs/promises";
import { PromisedDatabase } from "promised-sqlite3";
import { ASSETDB_DIR } from "../util/config";

export async function getConnection(
  assetDbDir: string = ASSETDB_DIR
): Promise<PromisedDatabase> {
  const filename = await getDbLocation(assetDbDir);

  const db = new PromisedDatabase();
  await db.open(filename);

  try {
    const res = await db.get('SELECT network_code from network limit 1');
    if (!res || res === '') {
      console.log('No networks found in database', res)
      throw new Error('No networks found in database');
    }
  } catch (err) {
    console.log('Error fetching database. Database is empty. Please run yarn update to get the latest version')
    throw err;
  }

  return Promise.resolve(db);
}

export async function getDbLocation(assetDbDir: string = ASSETDB_DIR): Promise<string> {
  const filename = await readFile(`${assetDbDir}/LATEST_ID`);
  const latestDb = assetDbDir + "/" + filename.toLocaleString();

  console.log('latestDb: ' + latestDb);

  return Promise.resolve((latestDb));
}