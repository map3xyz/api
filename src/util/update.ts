import dotenv from "dotenv";
import { existsSync } from "fs";
import "isomorphic-fetch";
import { createWriteStream } from "node:fs";
import { Octokit } from "octokit";

const ASSET_REPO_OWNER = "map3xyz";
const ASSET_REPO_NAME = "assets";

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

getLatestRelease().then((release) => console.log(`Done - ${release}`));

async function getLatestRelease(): Promise<string> {
  const release = await octokit.rest.repos.getLatestRelease({ owner: ASSET_REPO_OWNER, repo: ASSET_REPO_NAME });
  const exists = await doesAssetDbExist(release.data.tag_name);

  if (!exists) {
    const file = await createWriteStream(process.env.ASSETDB_DIR + "/" + release.data.tag_name);
    const response = await fetch(release.data.assets[0].browser_download_url);
    const body = await response.arrayBuffer();
    file.write(Buffer.from(body));
    file.close();

    const latest = await createWriteStream(process.env.ASSETDB_DIR + "/LATEST_ID");
    latest.write(release.data.tag_name);
    latest.close();
  }

  return Promise.resolve(release.data.tag_name);
}

async function doesAssetDbExist(tagName: string): Promise<boolean> {
  const dbExists = existsSync(process.env.ASSETDB_DIR + "/" + tagName);
  return Promise.resolve(dbExists);
}

