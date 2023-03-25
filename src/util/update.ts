import { existsSync, mkdirSync } from "fs";
import "isomorphic-fetch";
import { createWriteStream } from "node:fs";
import { log } from "../lib/telemetry";
import { ASSETDB_DIR } from "./config";

getLatestRelease().then((release) => console.log(`Done - ${release}`));

const EVERY_FIVE_MINUTES = 60 * 1000 * 5;

export function scheduleUpdates(interval: number = EVERY_FIVE_MINUTES) {
  setInterval(() => getLatestRelease().then((release) => console.log(`Done - ${release}`)), interval);
}

async function getLatestRelease(): Promise<string> {
  const release = await fetch("https://api.github.com/repos/map3xyz/assets/releases/latest").then((res) => res.json());
  const exists = await doesAssetDbExist(release.tag_name);

  if (!exists) {
    const file = await createWriteStream(ASSETDB_DIR + "/" + release.tag_name);

    const response = await fetch(release.assets[0].browser_download_url);
    const body = await response.arrayBuffer();
    file.write(Buffer.from(body));
    file.close();

    const latest = await createWriteStream(ASSETDB_DIR + "/LATEST_ID");
    latest.write(release.tag_name);
    latest.close();

    log("db_download", release.tag_name);
  }

  return Promise.resolve(release.tag_name);
}

async function doesAssetDbExist(tagName: string): Promise<boolean> {
  if (!existsSync(ASSETDB_DIR)) {
    mkdirSync(ASSETDB_DIR, { recursive: true });
  }

  const dbExists = existsSync(ASSETDB_DIR + "/" + tagName);
  return Promise.resolve(dbExists);
}

