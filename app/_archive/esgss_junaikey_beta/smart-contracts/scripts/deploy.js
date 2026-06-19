const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const TimestampRegistry = await hre.ethers.getContractFactory('TimestampRegistry');
  const registry = await TimestampRegistry.deploy(deployer.address);

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`TimestampRegistry deployed to: ${address}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
