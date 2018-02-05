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
    const user2 = accounts[2];
    const user3 = accounts[3];

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
            await dContract.registerAddress(user1);

            await assertReverts(async () => {
                await dContract.registerAddress(user1);
            });
        });
    });

    describe('#addressDeletion', () => {
        it('should allow to delete an address', async () => {
            await dContract.registerAddress(user1);
            await dContract.deRegisterAddress(user1);
            assert.isFalse(await dContract.isAddressRegistered(user1));
        });

        it('should revert when attempted to de-register not registered address',
            async () => {
                await assertReverts( async () => {
                    await dContract.deRegisterAddress(user1);
                });
            });
    });

    describe('#registrationStatus', () => {
        it('should correctly report registered addresses', async () => {
            await dContract.registerAddress(user1);
            assert.isTrue(await dContract.isAddressRegistered(user1));
        });

        it('should correctly report not registered addresses', async () => {
            assert.isFalse(await dContract.isAddressRegistered(user1));
        });

        it('should correctly report status after insertion and deletion',
            async () => {
                await dContract.registerAddress(user1);
                assert.isTrue(await dContract.isAddressRegistered(user1));
                await dContract.deRegisterAddress(user1);
                assert.isFalse(await dContract.isAddressRegistered(user1));
            });
    });

    describe('#addressesListing', () => {
       it('on initialisation should list empty list', async () => {
           const addressesList = await dContract.getAllAddresses();

           assert.deepEqual(addressesList, []);
       });

       it('should return registered address', async () => {
           await dContract.registerAddress(user1);
           const addressesList = await dContract.getAllAddresses();

           assert.deepEqual(addressesList, [user1]);
       });

       it('should return multiple registered addresses', async () => {
           await dContract.registerAddress(user1);
           await dContract.registerAddress(user2);
           await dContract.registerAddress(user3);
           const addressesList = await dContract.getAllAddresses();

           assert.deepEqual(addressesList, [user3, user2, user1]);
       });

       it('should correctly return addresses after deletion of the first',
           async () => {
               await dContract.registerAddress(user1);
               await dContract.registerAddress(user2);
               await dContract.registerAddress(user3);
               await dContract.deRegisterAddress(user1);

               const addressesList = await dContract.getAllAddresses();

               assert.deepEqual(addressesList, [user3, user2]);
           });

       it('should correctly return addresses after deletion of the last',
           async () => {
               await dContract.registerAddress(user1);
               await dContract.registerAddress(user2);
               await dContract.registerAddress(user3);
               await dContract.deRegisterAddress(user3);

               const addressesList = await dContract.getAllAddresses();

               assert.deepEqual(addressesList, [user2, user1]);
           });

       it('should correctly return addresses after deletion of the middle',
           async () => {
               await dContract.registerAddress(user1);
               await dContract.registerAddress(user2);
               await dContract.registerAddress(user3);
               await dContract.deRegisterAddress(user2);

               const addressesList = await dContract.getAllAddresses();

               assert.deepEqual(addressesList, [user3, user1]);
           });

       it('should correctly return addresses after multiple operations',
           async () => {
               await dContract.registerAddress(user1);
               await dContract.registerAddress(user2);
               await dContract.registerAddress(user3);
               await dContract.deRegisterAddress(user1);
               await dContract.registerAddress(user1);
               await dContract.deRegisterAddress(user2);
               await dContract.deRegisterAddress(user3);
               await dContract.registerAddress(user3);
               await dContract.deRegisterAddress(user1);
               await dContract.registerAddress(user2);
               await dContract.registerAddress(user1);

               const addressesList = await dContract.getAllAddresses();

               assert.deepEqual(addressesList, [user1, user2, user3]);
           });
    });

    describe('#batchAddressDeletion', () => {
        it('should delete all registered addresses', async () => {
            await dContract.registerAddress(user1);
            await dContract.registerAddress(user2);
            await dContract.deRegisterAll();

            assert.isFalse(await dContract.isAddressRegistered(user1));
            assert.isFalse(await dContract.isAddressRegistered(user2));
        });

        it('should not list any addresses after deletion', async () => {
            await dContract.registerAddress(user1);
            await dContract.registerAddress(user2);
            await dContract.deRegisterAll();
            const addressesList = await dContract.getAllAddresses();

            assert.deepEqual(addressesList, []);
        });
    });
});
