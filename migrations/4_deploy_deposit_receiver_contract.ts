import { DatabaseArtifacts } from 'database';
import { Deployer } from 'truffle';

declare const artifacts: DatabaseArtifacts;

const Database = artifacts.require('./Database.sol');
const DepositReceiverContract = artifacts.require('./DepositReceiver.sol');

async function deploy(deployer: Deployer, network: string) {
  const database = await Database.deployed();

  await deployer.deploy(DepositReceiverContract, database.address);
}

function migrate(deployer: Deployer, network: string) {
  deployer.then(() => deploy(deployer, network));
}

export = migrate;
