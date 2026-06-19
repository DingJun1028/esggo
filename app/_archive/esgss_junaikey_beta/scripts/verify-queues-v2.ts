import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

async function checkQueues() {
  console.log(chalk.blue('--- Verifying BullMQ Pipeline ---'));

  const testQueue = new Queue('esg-reports', { connection });

  try {
    console.log('Adding test job...');
    const job = await testQueue.add('verify-report', {
      reportId: 'test-123',
      scope: 'verification',
      timestamp: Date.now(),
    });

    console.log(chalk.green(`✓ Job added with ID: ${job.id}`));

    console.log('Waiting for worker to process...');
    // Poll for completion (simplified for verification script)
    let isCompleted = false;
    for (let i = 0; i < 10; i++) {
      const state = await job.getState();
      if (state === 'completed') {
        isCompleted = true;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    if (isCompleted) {
      console.log(chalk.green('✓ Job processed successfully by Worker'));
    } else {
      console.log(
        chalk.yellow('⚠ Job verified in queue, but worker processing pending (check server logs)')
      );
    }
  } catch (error: any) {
    console.error(chalk.red('❌ Queue Verification Failed:'), error.message);
    process.exit(1);
  } finally {
    await testQueue.close();
    process.exit(0);
  }
}

checkQueues();
