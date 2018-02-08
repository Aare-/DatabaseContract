import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import { DatabaseArtifacts, DatabaseBase } from 'database';
import { ContractContextDefinition } from 'truffle';
import * as Web3 from 'web3';
import { assertNumberEqual, assertReverts, ZERO_ADDRESS } from './helpers';

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

  describe('#ctor', () => {
    it('should successfully create contract', async () => {
      assert.isNotNull(dContract);
    });
  });

  describe('#addressAddition', () => {
    it('should allow to add addresses', async () => {
      await performOperationsOnContract('r1');
    });

    it('should disallow adding duplicate addresses', async () => {
      await performOperationsOnContract('r1');

      await assertReverts(async () => {
        await performOperationsOnContract('r1');
      });
    });

    it('should allow only valid addresses', async () => {
      await assertReverts(async () => {
        await dContract.registerAddress(ZERO_ADDRESS);
      });
    });

    it('should allow only owner for adding addresses', async () => {
      await assertReverts(async () => {
        await dContract.registerAddress(user1, { from: user2 });
      });
    });
  });

  describe('#addressDeletion', () => {
    it('should allow to delete an address', async () => {
      await performOperationsOnContract('r1 d1');
      assert.isFalse(await dContract.isAddressRegistered(user1));
    });

    it('should revert when de-registering not registered address', async () => {
      await assertReverts(async () => {
        await performOperationsOnContract('d1');
      });
    });

    it('should allow only owner for deleting addresses', async () => {
      await assertReverts(async () => {
        await performOperationsOnContract('r1');
        await dContract.deRegisterAddress(user1, { from: user2 });
      });
    });
  });

  describe('#registrationStatus', () => {
    it('should correctly report registered addresses', async () => {
      await performOperationsOnContract('r1');
      assert.isTrue(await dContract.isAddressRegistered(user1));
    });

    it('should correctly report not registered addresses', async () => {
      assert.isFalse(await dContract.isAddressRegistered(user1));
    });

    it('should report status after insertion and deletion', async () => {
      await performOperationsOnContract('r1');
      assert.isTrue(await dContract.isAddressRegistered(user1));
      await performOperationsOnContract('d1');
      assert.isFalse(await dContract.isAddressRegistered(user1));
    });
  });

  describe('#addressesListing', () => {
    it('on initialisation should list empty list', async () => {
      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, []);
    });

    it('should return registered address', async () => {
      await performOperationsOnContract('r1');
      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user1]);
    });

    it('should return multiple registered addresses', async () => {
      await performOperationsOnContract('r1 r2 r3');
      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user3, user2, user1]);
    });

    it('should return addresses after deletion of the first', async () => {
      await performOperationsOnContract('r1 r2 r3 d1');

      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user3, user2]);
    });

    it('should return addresses after deletion of the last', async () => {
      await performOperationsOnContract('r1 r2 r3 d3');

      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user2, user1]);
    });

    it('should return addresses after deletion of the middle', async () => {
      await performOperationsOnContract('r1 r2 r3 d2');

      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user3, user1]);
    });

    it('should return addresses after multiple operations', async () => {
      await performOperationsOnContract('r1 r2 r3 d1 r1 d2 d3 r3 d1 r2 r1');

      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, [user1, user2, user3]);
    });
  });

  describe('#batchAddressDeletion', () => {
    it('should delete all registered addresses', async () => {
      await performOperationsOnContract('r1 r2');
      await dContract.deRegisterAll();

      assert.isFalse(await dContract.isAddressRegistered(user1));
      assert.isFalse(await dContract.isAddressRegistered(user2));
    });

    it('should not list any addresses after deletion', async () => {
      await performOperationsOnContract('r1 r2');
      await dContract.deRegisterAll();
      const addressesList = await dContract.getAllAddresses();

      assert.deepEqual(addressesList, []);
    });

    it('single address deletion should cost less than 10000 gas', async () => {
      await performOperationsOnContract('r1');
      const transactionReceipt1 = await dContract.deRegisterAll();

      await performOperationsOnContract('r1 r2');
      const transactionReceipt2 = await dContract.deRegisterAll();

      const gasUsageDelta =
        transactionReceipt2.receipt.gasUsed -
        transactionReceipt1.receipt.gasUsed;

      assert.isBelow(gasUsageDelta, 10000);
    });

    it('should allow only owner for deleting all addresses', async () => {
      await assertReverts(async () => {
        await dContract.deRegisterAll({ from: user2 });
      });
    });
  });

  describe('#getNextAddress', () => {
    it('should correctly return address for given predecessor', async () => {
      await performOperationsOnContract('r1 r2');

      const nextAddress = await dContract.getNextAddress(user2);
      assert.deepEqual(nextAddress, user1);
    });

    it('should return address when asked for the last address', async () => {
      await performOperationsOnContract('r1 r2 r3');

      const nextAddress = await dContract.getNextAddress(user1);
      assert.deepEqual(nextAddress, user1);
    });

    it('should return address(0) for not registered addresses', async () => {
      await performOperationsOnContract('r1');

      const nextAddress = await dContract.getNextAddress(user2);
      assert.deepEqual(nextAddress, ZERO_ADDRESS);
    });
  });

  describe('#countAddresses', () => {
    it('should correctly report address count for empty list', async () => {
      const addressCount = await dContract.countAddresses();

      assertNumberEqual(addressCount, new BigNumber(0));
    });

    it('should correctly report address count for populated list', async () => {
      await performOperationsOnContract('r1 r2 r3');
      const addressCount = await dContract.countAddresses();

      assertNumberEqual(addressCount, new BigNumber(3));
    });

    it('should correctly report size after address changes', async () => {
      await performOperationsOnContract('r1 d1 r2 r3');

      const addressCount = await dContract.countAddresses();

      assertNumberEqual(addressCount, new BigNumber(2));
    });
  });

  enum OperationType {
    Registration,
    DeRegistration,
    Invalid
  }

  /*
     Performs operations on dContract using following scheme:
     <action><account_number>
     where:
     action - Denotes action to perform, where applicable action symcols are:
      'd': de-register address
      'r': register address
      account_number - Denotes account to use, avaliable symbols are 1, 2 or 3

     Example: Following string would result in registration of account 1
     followed by it's de-registration
     'r1 d1'
     */
  async function performOperationsOnContract(operations: string) {
    operations = operations.replace(/ /g, '').toLowerCase();
    const operationsCount = Math.floor(operations.length / 2);

    for (let i = 0; i < operationsCount; i++) {
      const operationType: OperationType = getOperationType(operations[i * 2]);
      const account = getOperationAccount(operations[i * 2 + 1]);

      if (operationType === OperationType.Invalid || account === ZERO_ADDRESS) {
        throw new Error('Error in provided operations list: ' + operations);
      }

      switch (operationType) {
        case OperationType.Registration:
          await dContract.registerAddress(account);
          break;
        case OperationType.DeRegistration:
          await dContract.deRegisterAddress(account);
          break;
      }
    }
  }

  function getOperationType(operationSymbol: string): OperationType {
    switch (operationSymbol) {
      case 'r':
        return OperationType.Registration;
      case 'd':
        return OperationType.DeRegistration;
      default:
        return OperationType.Invalid;
    }
  }

  function getOperationAccount(accountSymbol: string) {
    switch (accountSymbol) {
      case '1':
        return user1;
      case '2':
        return user2;
      case '3':
        return user3;
      default:
        return ZERO_ADDRESS;
    }
  }
});
