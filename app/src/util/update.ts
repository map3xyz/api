import "isomorphic-fetch";
import { createWriteStream } from "node:fs";
import { mkdir, open } from "node:fs/promises";
import { Octokit } from "octokit";
const { StringDecoder } = require("node:string_decoder");

const ASSET_REPO_OWNER = "map3xyz";
const ASSET_REPO_NAME = "assets";
const ASSET_DB_DIR = "/tmp/assetdb";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

getLatestRelease().then((res) => console.log(res));
console.log("Done");

async function getLatestRelease(): Promise<string> {
  const release = await octokit.rest.repos.getLatestRelease({ owner: ASSET_REPO_OWNER, repo: ASSET_REPO_NAME });
  const exists = await doesAssetDbExist(release.data.tag_name);

  if (!exists) {
    const decoder = new StringDecoder("utf8");
    const file = await createWriteStream(ASSET_DB_DIR + "/" + release.data.tag_name);
    const response = await fetch(release.data.assets[0].browser_download_url);
    const body = await response.text();
    file.write(decoder.end(body));
    file.close();

    const latest = await createWriteStream(ASSET_DB_DIR + "/LATEST_ID");
    latest.write(release.data.tag_name);
    latest.close();
  }

  return Promise.resolve(release.data.tag_name);
}

async function doesAssetDbExist(tagName: string): Promise<boolean> {
  let dbExists = false;

  try {
    const dir = await mkdir(ASSET_DB_DIR);
    const file = await open(ASSET_DB_DIR + "/" + tagName, "ro");
    dbExists = true;
  } catch (err: any) {}

  return Promise.resolve(dbExists);
}

