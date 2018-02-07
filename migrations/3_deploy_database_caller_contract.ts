import { DatabaseArtifacts } from 'database';
import { Deployer } from 'truffle';

declare const artifacts: DatabaseArtifacts;

const DatabaseCallerContract = artifacts.require('./DatabaseCaller.sol');

async function deploy(deployer: Deployer, network: string) {
  await deployer.deploy(DatabaseCallerContract);
}

function migrate(deployer: Deployer, network: string) {
  deployer.then(() => deploy(deployer, network));
}

export = migrate;
