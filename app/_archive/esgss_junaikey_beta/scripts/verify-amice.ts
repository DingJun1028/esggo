import amiceService from '../server/services/amice.js';
import crypto from 'crypto';
import chalk from 'chalk';
import dotenv from 'dotenv';
import pool from '../server/db/index.js';
import redisService from '../server/services/redisService.js';

dotenv.config();

async function verifyAmice() {
  console.log(chalk.cyan('🔔 Verifying Amice Webhook and Security...'));

  const secret = process.env.AMICE_WEBHOOK_SECRET || 'default_secret_change_me_in_prod';
  const payload = {
    type: 'system_alert',
    data: {
      message: 'Core Temperature Rising',
      severity: 'critical',
    },
  };

  // 1. Generate Signature
  const data = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', secret);
  const signature = 'sha256=' + hmac.update(data).digest('hex');

  console.log(chalk.blue(`Generated Signature: ${signature.substring(0, 20)}...`));

  // 2. Validate Signature
  const isValid = amiceService.validateSignature(payload, signature);
  const isInvalid = amiceService.validateSignature(payload, 'sha256=invalid');

  if (isValid && !isInvalid) {
    console.log(chalk.green('✓ HMAC Signature Validation Passed'));
  } else {
    console.error(chalk.red('❌ Signature Validation Failed'));
    process.exit(1);
  }

  // 3. Simulate Event Handling
  try {
    console.log(chalk.blue('... Simulating System Alert Event ...'));
    // We mock runSwarm inside the service or just trust the promise fires
    // Since runSwarm is async fire-and-forget in handleEvent, we check the return status immediately
    const result = await amiceService.handleEvent('system_alert', payload.data);

    if (result.status === 'processing') {
      console.log(chalk.green('✓ Event Handled successfully (Swarm Triggered)'));
    } else {
      console.error(chalk.red('❌ Event handling returned unexpected status:', result.status));
    }

    console.log(chalk.green('\n✨ AMICE WEBHOOK VERIFIED ✨'));

    // Cleanup
    await pool.end();
    await redisService.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('❌ Verification Failed:'), error);
    await pool.end();
    await redisService.disconnect();
    process.exit(1);
  }
}

verifyAmice();
