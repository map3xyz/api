import { TelemetryCategory } from "@map3xyz/telemetry";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

export const UUID_DIR = "/tmp/uuid.txt";
export const ASSETDB_DIR = process.env.ASSETDB_DIR || "/data/map3api/tmp/assetdb";
export const SERVER_PORT = parseInt(process.env.SERVER_PORT + "") || 3002;
export const TELEMETRY_CATEGORY = (process.env.TELEMETRY_CATEGORY || "oss") as TelemetryCategory;

