import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const CONTAINER_NAME = 'esg-db';
const DB_USER = process.env.DB_USER || 'esg_user';
const DB_NAME = process.env.DB_NAME || 'esg_dashboard';
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filePath = path.join(BACKUP_DIR, filename);

    console.log(`🚀 Starting backup for ${DB_NAME}...`);

    try {
        // Check if container is running
        await execPromise(`docker ps -q -f name=${CONTAINER_NAME}`);

        // Run pg_dump via docker exec
        // Note: We capture stdout to write to file
        const command = `docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} ${DB_NAME}`;

        // Increase maxBuffer for large backups (e.g., 50MB)
        const { stdout, stderr } = await execPromise(command, { maxBuffer: 50 * 1024 * 1024 });

        if (stderr) {
            // pg_dump outputs info messages to stderr, warn but don't fail unless empty stdout
            console.warn(`Warning/Info during backup: ${stderr}`);
        }

        if (!stdout) {
            throw new Error('Backup produced empty output.');
        }

        fs.writeFileSync(filePath, stdout);
        console.log(`✅ Backup successful! Saved to: ${filePath}`);
        console.log(`📦 Size: ${(stdout.length / 1024 / 1024).toFixed(2)} MB`);

    } catch (error: any) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

backupDatabase();
