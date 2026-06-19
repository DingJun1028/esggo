import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import readline from 'readline';

const execPromise = util.promisify(exec);

// Configuration
const CONTAINER_NAME = 'esg-db';
const DB_USER = process.env.DB_USER || 'esg_user';
const DB_NAME = process.env.DB_NAME || 'esg_dashboard';
const BACKUP_DIR = path.join(process.cwd(), 'backups');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function restoreDatabase() {
    console.log(`🚀 Starting RESTORE process for ${DB_NAME}...`);

    // 1. List available backups
    if (!fs.existsSync(BACKUP_DIR)) {
        console.error('❌ No backups directory found.');
        process.exit(1);
    }

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql')).sort().reverse();

    if (files.length === 0) {
        console.error('❌ No backup files found.');
        process.exit(1);
    }

    console.log('Available backups:');
    files.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
    });

    // 2. Select backup
    rl.question('Select backup number to restore (or q to quit): ', async (answer) => {
        if (answer.toLowerCase() === 'q') {
            rl.close();
            return;
        }

        const index = parseInt(answer) - 1;
        if (isNaN(index) || index < 0 || index >= files.length) {
            console.error('❌ Invalid selection.');
            rl.close();
            return;
        }

        const selectedFile = files[index];
        const filePath = path.join(BACKUP_DIR, selectedFile);

        console.log(`\n⚠️  WARNING: This will OVERWRITE the database '${DB_NAME}' with data from '${selectedFile}'.`);
        rl.question('Type "CONFIRM" to proceed: ', async (confirm) => {
            if (confirm !== 'CONFIRM') {
                console.log('❌ Restore cancelled.');
                rl.close();
                return;
            }

            try {
                console.log(`Restoring from ${selectedFile}...`);

                // Check container
                await execPromise(`docker ps -q -f name=${CONTAINER_NAME}`);

                // Drop and Recreate Schema (safest for full restore)
                // Or just pipe psql. pg_dump exports usually handle potential conflicts if --clean is used, 
                // but default simple dump might fail on existing constraints.
                // For simplicity in this script, we assume the dump can be applied on top or user handles clean slate.
                // A better approach often involves: docker exec -i CONTAINER psql -U USER DB < file

                // Construct command: cat file | docker exec -i CONTAINER psql ...
                const command = `docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME}`;

                // We use child_process.spawn or exec with input stream
                // But exec takes a command string. We can pipe in shell.
                // Ensure strictly shell execution.

                // Windows syntax might differ for piping. 
                // Let's use readFileSync and pass to stdin of spawned process for cross-platform robustness if possible,
                // or just use specific shell syntax since this is a dev script.
                // "type file | docker ..." on windows? "cat file | docker ..." on bash?

                // Let's rely on Node.js stream to stdin of docker process.
                const { spawn } = await import('child_process');
                const dockerProcess = spawn('docker', ['exec', '-i', CONTAINER_NAME, 'psql', '-U', DB_USER, '-d', DB_NAME], {
                    stdio: ['pipe', 'inherit', 'inherit']
                });

                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(dockerProcess.stdin);

                dockerProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Restore completed successfully!');
                    } else {
                        console.error(`❌ Restore process exited with code ${code}`);
                    }
                    rl.close();
                });

            } catch (error: any) {
                console.error('❌ Restore failed:', error.message);
                rl.close();
            }
        });
    });
}

restoreDatabase();
