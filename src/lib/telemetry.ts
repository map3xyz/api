import { TelemetryAction, track } from "@map3xyz/telemetry";
import { TELEMETRY_CATEGORY } from "../util/config";
import { getUUID } from "../util/uuid";
import os from 'os';

export function log(action: TelemetryAction, label?: string): void {
    track('api', TELEMETRY_CATEGORY, action, label || os.version(), getUUID());
}