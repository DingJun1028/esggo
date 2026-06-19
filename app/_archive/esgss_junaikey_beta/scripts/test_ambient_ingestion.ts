import { ambientDataService } from '../server/services/AmbientDataService.js';
import chalk from 'chalk';

async function testAmbientIngestion() {
    console.log(chalk.magenta('--- Phase 20: Ambient AI Ingestion Audit ---'));

    let measurementCount = 0;
    const targetCount = 3;

    return new Promise((resolve, reject) => {
        console.log(chalk.gray(`Waiting for ${targetCount} real-time IoT pulses...`));

        const timeout = setTimeout(() => {
            ambientDataService.stopSimulation();
            reject(new Error('Ingestion timeout after 20 seconds'));
        }, 20000);

        ambientDataService.on('measurement', (m) => {
            measurementCount++;
            console.log(chalk.white(`   [Pulse ${measurementCount}] ${chalk.bold(m.type)}: ${m.value.toFixed(2)} ${m.unit} (Sensor: ${m.sensorId})`));

            if (measurementCount >= targetCount) {
                clearTimeout(timeout);
                ambientDataService.stopSimulation();
                console.log(chalk.green(`   [DONE] Received ${measurementCount} real-time measurements.`));
                console.log(chalk.magenta('--- Ambient Audit Complete ---'));
                resolve(true);
            }
        });

        // Start simulation if not already started
        ambientDataService.startSimulation();
    });
}

testAmbientIngestion().catch(err => {
    console.error(chalk.red('Verification failed:'), err);
    process.exit(1);
});
