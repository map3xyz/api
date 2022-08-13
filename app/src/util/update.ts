import { existsSync } from "fs";
import "isomorphic-fetch";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { Octokit } from "octokit";

const ASSET_REPO_OWNER = "map3xyz";
const ASSET_REPO_NAME = "assets";
const ASSET_DB_DIR = "/tmp/assetdb";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

getLatestRelease().then((release) => console.log(`Done - ${release}`));

async function getLatestRelease(): Promise<string> {
  const release = await octokit.rest.repos.getLatestRelease({ owner: ASSET_REPO_OWNER, repo: ASSET_REPO_NAME });
  const exists = await doesAssetDbExist(release.data.tag_name);

  if (!exists) {
    const file = await createWriteStream(ASSET_DB_DIR + "/" + release.data.tag_name);
    const response = await fetch(release.data.assets[0].browser_download_url);
    const body = await response.arrayBuffer();
    file.write(Buffer.from(body));
    file.close();

    const latest = await createWriteStream(ASSET_DB_DIR + "/LATEST_ID");
    latest.write(release.data.tag_name);
    latest.close();
  }

  return Promise.resolve(release.data.tag_name);
}

async function doesAssetDbExist(tagName: string): Promise<boolean> {
  if (!existsSync(ASSET_DB_DIR)) {
    await mkdir(ASSET_DB_DIR);
  }

  const dbExists = existsSync(ASSET_DB_DIR + "/" + tagName);
  return Promise.resolve(dbExists);
}

