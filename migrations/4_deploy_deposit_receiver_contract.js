"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Database = artifacts.require('./Database.sol');
const DepositReceiverContract = artifacts.require('./DepositReceiver.sol');
function deploy(deployer, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield Database.deployed();
        yield deployer.deploy(DepositReceiverContract, database.address);
    });
}
function migrate(deployer, network) {
    deployer.then(() => deploy(deployer, network));
}
module.exports = migrate;
