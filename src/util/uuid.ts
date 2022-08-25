import crypto from 'crypto';
import fs from 'fs';
import { UUID_DIR } from './config';

let id: string;

export function getUUID() {
    if (!id) {
        if(fs.existsSync(UUID_DIR)) {
            id = fs.readFileSync(UUID_DIR, 'utf8');
        } else {
            id = crypto.randomBytes(16).toString('hex');
            fs.writeFileSync(UUID_DIR, id);
        }
    }
    
    return id;
}