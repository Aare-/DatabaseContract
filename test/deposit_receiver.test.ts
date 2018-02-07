import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import { DatabaseArtifacts, DatabaseBase, DepositReceiverBase } from 'database';
import { ContractContextDefinition } from 'truffle';
import * as Web3 from 'web3';
import { fromEth, Web3Utils } from '../utils';
import { assertNumberEqual, assertReverts } from './helpers';

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseContract = artifacts.require('./Database.sol');
const DepositReceiverContract = artifacts.require('./DepositReceiver.sol');

contract('DepositReceiver', accounts => {
  const w3Utils: Web3Utils = new Web3Utils(web3);

  let dContract: DatabaseBase;
  let depositReceiverContract: DepositReceiverBase;

  const user1 = accounts[1];
  const user2 = accounts[2];

  const zeroAmount = new BigNumber(0);
  const singleDepositAmount = fromEth(0.1);
  const doubleDepositAmount = singleDepositAmount.mul(2);

  beforeEach(async () => {
    dContract = await DatabaseContract.new();
    depositReceiverContract = await DepositReceiverContract.new(
      dContract.address
    );
  });

  describe('#ctor', () => {
    it('should successfully create new deposit receiver contract', async () => {
      assert.isNotNull(depositReceiverContract);
    });
  });

  describe('#deposit', () => {
    beforeEach(async () => {
      await dContract.registerAddress(user1);
    });

    it('should allow deposits from registered accounts ', async () => {
      await depositReceiverContract.deposit({
        from: user1,
        value: singleDepositAmount
      });

      const balanceAfterDeposit = await depositReceiverContract.getBalance({
        from: user1
      });

      assertNumberEqual(balanceAfterDeposit, singleDepositAmount);
    });

    it('should revert deposits not registered in database', async () => {
      await assertReverts(async () => {
        await depositReceiverContract.deposit({
          from: user2,
          value: singleDepositAmount
        });
      });
    });

    it('should accept deposits sent to fallback function', async () => {
      await depositReceiverContract.sendTransaction({
        from: user1,
        value: singleDepositAmount
      });

      const balanceAfterDeposit = await depositReceiverContract.getBalance({
        from: user1
      });

      assertNumberEqual(balanceAfterDeposit, singleDepositAmount);
    });
  });

  describe('#balance', () => {
    beforeEach(async () => {
      await dContract.registerAddress(user1);
    });

    it('should revert when asked for balance of invalid address', async () => {
      await assertReverts(async () => {
        await depositReceiverContract.getBalance({ from: user2 });
      });
    });

    it('should report empty for newly registered addresses', async () => {
      const accountBalance = await depositReceiverContract.getBalance({
        from: user1
      });

      assertNumberEqual(accountBalance, new BigNumber(0));
    });

    it('should correctly report address balance', async () => {
      await depositReceiverContract.deposit({
        from: user1,
        value: singleDepositAmount
      });
      const accountBalance = await depositReceiverContract.getBalance({
        from: user1
      });

      assertNumberEqual(accountBalance, new BigNumber(singleDepositAmount));
    });

    it('should correctly report balance after multiple transfers', async () => {
      await depositReceiverContract.deposit({
        from: user1,
        value: singleDepositAmount
      });
      await depositReceiverContract.deposit({
        from: user1,
        value: singleDepositAmount
      });

      const accountBalance = await depositReceiverContract.getBalance({
        from: user1
      });

      assertNumberEqual(accountBalance, doubleDepositAmount);
    });
  });

  describe('#withdraw', () => {
    beforeEach(async () => {
      await dContract.registerAddress(user1);
      await depositReceiverContract.deposit({
        from: user1,
        value: singleDepositAmount
      });
    });

    it('should revert withdrawals for addresses not in database', async () => {
      await dContract.deRegisterAddress(user1);

      await assertReverts(async () => {
        await depositReceiverContract.withdraw(singleDepositAmount, {
          from: user1
        });
      });
    });

    it('should revert empty withdrawals', async () => {
      await assertReverts(async () => {
        await depositReceiverContract.withdraw(zeroAmount, { from: user1 });
      });
    });

    it('should not allow withdrawals exceeding deposited amount', async () => {
      await assertReverts(async () => {
        await depositReceiverContract.withdraw(doubleDepositAmount, {
          from: user1
        });
      });
    });

    it('should allow full balance withdrawal', async () => {
      const balanceBeforeWithdrawal: any = await w3Utils.getBalance(user1);

      await depositReceiverContract.withdraw(singleDepositAmount, {
        from: user1
      });

      const balanceAfterWithdrawal: any = await w3Utils.getBalance(user1);

      assert.isTrue(
        balanceAfterWithdrawal.greaterThan(balanceBeforeWithdrawal)
      );
    });

    it('should subtract withdrawn amount from user balance', async () => {
      await depositReceiverContract.withdraw(singleDepositAmount, {
        from: user1
      });

      const balance = await depositReceiverContract.getBalance({ from: user1 });

      assertNumberEqual(balance, zeroAmount);
    });
  });
});
