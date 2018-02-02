import {ContractContextDefinition} from "truffle";
import * as Web3 from "web3";
import {DatabaseArtifacts} from "database";

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseContract = artifacts.require('./Database.sol');