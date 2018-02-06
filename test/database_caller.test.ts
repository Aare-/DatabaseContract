import { assert } from 'chai';
import {
    DatabaseArtifacts, DatabaseBase, DatabaseCallerBase,
    DatabaseCallerContract, DatabaseContract
} from 'database';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseCallerContract = artifacts.require('./DatabaseCaller.sol');
const DatabaseContract = artifacts.require('./Database.sol');

contract('DatabaseCaller', accounts => {
    let dbCallerContract: DatabaseCallerBase;
    let dContract: DatabaseBase;
    let anotherDContract: DatabaseBase;
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    beforeEach(async () => {
        dContract = await DatabaseContract.new();
        dbCallerContract = await DatabaseCallerContract.new();
    });

    describe('#ctor', () => {
       it('should successfully create new database caller contract',
           async () => {
               assert.isNotNull(dbCallerContract);
           });
    });

    describe('#collectData', () => {
        it('should correctly collect data from empty database',
            async () => {
                const addressesList
                    = await dbCallerContract.collectData(dContract.address);
                assert.deepEqual(addressesList, []);
            });

        it('should correctly collect data from populated database',
            async () => {
                await dContract.registerAddress(user1);
                await dContract.registerAddress(user2);
                await dContract.registerAddress(user3);

                const addressesList
                    = await dbCallerContract.collectData(dContract.address);

                assert.deepEqual(addressesList, [user3, user2, user1]);
            });

        it('should correctly collect data from different databases',
            async () => {
                anotherDContract = await DatabaseContract.new();

                await dContract.registerAddress(user1);
                await anotherDContract.registerAddress(user2);

                const addressesList1 = await dbCallerContract
                    .collectData(dContract.address);
                const addressesList2 = await dbCallerContract
                    .collectData(anotherDContract.address);

                assert.deepEqual(addressesList1, [user1]);
                assert.deepEqual(addressesList2, [user2]);
            });
    });
});
