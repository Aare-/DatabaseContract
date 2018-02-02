import {ContractContextDefinition} from "truffle";
import * as Web3 from "web3";
import {DatabaseArtifacts} from "database";
import * as assert from "assert";
import {assertReverts} from "./helpers";

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseContract = artifacts.require('./Database.sol');

contract('Database', accounts => {
    const user1 = accounts[1];
    const user2 = accounts[2];

    async function createContract() {
        return await DatabaseContract.new();
    }

    describe("#ctor", () => {
        it('should successfully create contract', async () => {
            const contract = await createContract();
            assert.equal(contract != null, true);
        });
    });

    describe("#addressAddition", () => {
        it('should allow to add addresses', async () => {
            const contract = await createContract();
            assert.equal(await contract.registerAddress(user1), true);
        });

        it('should disallow adding duplicate addresses', async () => {
            const contract = await createContract();
            assert.equal(await contract.registerAddress(user2), true);
            assert.equal(await contract.registerAddress(user2), false);
        });

        it('should revert if empty address is provided', async () => {
            const contract = await createContract();
            const emptyAddress = '';

            await assertReverts(async () => {
               await contract.registerAddress(emptyAddress);
            });
        });

        it('should revert if incorrect address is provided', async () => {
            const contract = await createContract();
            const incorrectAddress = 'veryIncorrectAddress';

            await assertReverts(async () => {
                await contract.registerAddress(incorrectAddress);
            });
        });

    });
});