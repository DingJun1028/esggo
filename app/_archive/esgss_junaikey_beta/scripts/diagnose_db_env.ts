
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from specific path
const envPath = path.join(__dirname, '../server/.env');
console.log(`Loading env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env file:", result.error);
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("DATABASE_URL is not set.");
} else {
    console.log("DATABASE_URL is set.");
    // Mask the credentials
    const maskedUrl = dbUrl.replace(/:\/\/.*@/, '://****:****@');
    console.log(`Masked URL: ${maskedUrl}`);

    try {
        const url = new URL(dbUrl);
        console.log(`Hostname: ${url.hostname}`);

        dns.lookup(url.hostname, (err, address, family) => {
            if (err) {
                console.error(`DNS Lookup failed for ${url.hostname}:`, err);
            } else {
                console.log(`DNS Lookup success: ${url.hostname} -> ${address}`);
            }
        });
    } catch (e) {
        console.error("Failed to parse DATABASE_URL:", e);
    }
}
