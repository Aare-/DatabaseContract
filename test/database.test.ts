import { assert } from 'chai';
import {DatabaseArtifacts, DatabaseBase} from 'database';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';
import {assertReverts} from './helpers';

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseContract = artifacts.require('./Database.sol');

contract('DatabaseBase', accounts => {
    let dContract: DatabaseBase;
    const user1 = accounts[1];

    beforeEach(async () => {
        dContract = await DatabaseContract.new();
    });

    describe('"#ctor', () => {
        it('should successfully create contract', async () => {
            assert.isNotNull(dContract);
        });
    });

    describe('#addressAddition', () => {
        it('should allow to add addresses', async () => {
            await dContract.registerAddress(user1);
        });

        it('should disallow adding duplicate addresses', async () => {
            await assertReverts(async () => {
                await dContract.registerAddress(user1);
                await dContract.registerAddress(user1);
            });
        });
    });

    describe('#addressDeletion', () => {
        it('should allow to delete an address', async () => {
            await dContract.registerAddress(user1);
            await dContract.deRegisterAddress(user1);
        });

        it('should revert when attempted to de-register not registered address',
            async () => {
                await assertReverts( async () => {
                    await dContract.deRegisterAddress(user1);
                });
            });
    });
});
