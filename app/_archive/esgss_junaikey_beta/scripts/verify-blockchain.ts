import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

async function verifyBlockchain() {
  console.log(chalk.blue('--- Verifying Blockchain Anchor ---'));

  const testHash = '0x' + Array(64).fill('a').join('');
  const metadata = { type: 'audit_log', agentId: 'test-agent' };

  try {
    console.log('Anchoring test hash...');
    const res = await axios.post(`${API_URL}/anchor`, { hash: testHash, metadata });

    if (res.data.status) {
      console.log(chalk.green(`✓ Anchor Success: ${res.data.status}`));
      console.log(chalk.gray(`  Tx Hash: ${res.data.txHash}`));
      console.log(chalk.gray(`  Explorer: ${res.data.explorerUrl}`));
    } else {
      throw new Error('Invalid response');
    }
  } catch (error: any) {
    console.error(chalk.red('❌ Verification Failed:'), error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

verifyBlockchain();
