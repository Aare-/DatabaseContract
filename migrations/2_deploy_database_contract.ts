import { DatabaseArtifacts } from 'database';
import { Deployer } from 'truffle';

declare const artifacts: DatabaseArtifacts;

const DatabaseContract = artifacts.require('./Database.sol');

async function deploy(deployer: Deployer) {
    await deployer.deploy(DatabaseContract);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
