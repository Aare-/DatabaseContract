import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import {
    DatabaseArtifacts, DatabaseBase, DatabaseCallerBase,
    DatabaseCallerContract, DatabaseContract, DepositReceiverBase
} from 'database';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';
import {fromEth, fromFinney, fromGwei, fromKwei} from '../utils';
import {promisify} from '../utils/common';
import {
    assertNumberAlmostEqual, assertNumberEqual,
    assertReverts
} from './helpers';

declare const web3: Web3;
declare const artifacts: DatabaseArtifacts;
declare const contract: ContractContextDefinition;

const DatabaseContract = artifacts.require('./Database.sol');
const DepositReceiverContract  = artifacts.require('./DepositReceiver.sol');

contract('DepositReceiver', accounts => {
    let dContract: DatabaseBase;
    let depositReceiverContract: DepositReceiverBase;

    const user1 = accounts[1];

    const zeroAmount = new BigNumber(0);
    const singleDepositAmount = fromEth(0.1);
    const doubleDepositAmount = singleDepositAmount.mul(2);

    beforeEach(async () => {
        dContract = await DatabaseContract.new();
        depositReceiverContract
            = await DepositReceiverContract.new(dContract.address);
    });

    describe('#ctor', () => {
       it('should successfully create new deposit receiver contract',
           async () => {
                assert.isNotNull(depositReceiverContract);
           });
    });

    describe('#deposit', () => {
       it('should allow deposits from accounts registered in database',
           async () => {
                await dContract.registerAddress(user1);

                await depositReceiverContract
                    .deposit({
                        from: user1,
                        value: singleDepositAmount
                    });
           });

       it('should revert deposits not registered in database',
           async () => {
               await assertReverts(async () => {
                   await depositReceiverContract
                       .deposit({
                           from: user1,
                           value: singleDepositAmount
                       });
               });
           });

       it('should stop accepting deposits from users removed from database',
           async () => {
               await dContract.registerAddress(user1);

               await depositReceiverContract
                   .deposit({
                       from: user1,
                       value: singleDepositAmount
                   });

               await dContract.deRegisterAddress(user1);

               await assertReverts(async () => {
                   await depositReceiverContract
                       .deposit({
                           from: user1,
                           value: singleDepositAmount
                       });
               });
           });
    });

    describe('#balance', () => {
       it('should revert when asked for balance of not registered address',
           async () => {
                await assertReverts(async () => {
                    await depositReceiverContract.getBalance({from: user1});
                });
           });

       it('should report empty for newly registered addresses',
           async () => {
                await dContract.registerAddress(user1);
                const accountBalance = await depositReceiverContract
                    .getBalance({from: user1});

                assertNumberEqual(accountBalance, new BigNumber(0));
           });

       it('should correctly report address balance',
           async () => {
               const depositAmount = fromGwei(1);

               await dContract.registerAddress(user1);
               await depositReceiverContract
                   .sendTransaction({
                       from: user1,
                       value: depositAmount
                   });
               const accountBalance
                   = await depositReceiverContract.getBalance({from: user1});

               assertNumberEqual(accountBalance, new BigNumber(depositAmount));
           });

       it('should correctly report balance after multiple transfers',
           async () => {
               await dContract.registerAddress(user1);

               await depositReceiverContract
                   .sendTransaction({
                       from: user1,
                       value: singleDepositAmount
                   });
               await depositReceiverContract
                   .sendTransaction({
                       from: user1,
                       value: singleDepositAmount
                   });

               const accountBalance
                   = await depositReceiverContract.getBalance({from: user1});

               assertNumberEqual(
                   accountBalance,
                   doubleDepositAmount);
           });
    });

    describe('#withdraw', () => {
        beforeEach(async () => {
            await dContract.registerAddress(user1);
            await depositReceiverContract
                .deposit({
                    from: user1,
                    value: singleDepositAmount
                });
        });

        it('should revert withdrawals for addresses not in database',
            async () => {
                await dContract.deRegisterAddress(user1);

                await assertReverts(
                    async () => {
                        await depositReceiverContract
                            .withdraw(singleDepositAmount, {from: user1});
                    });
            });

        it('should revert empty withdrawals',
            async () => {
                await assertReverts(
                    async () => {
                        await depositReceiverContract
                            .withdraw(zeroAmount, {from: user1});
                    });
            });

        it('should not allow withdrawals exceeding deposited amount',
            async () => {
                await assertReverts(
                    async () => {
                        await depositReceiverContract
                            .withdraw(doubleDepositAmount, {from: user1});
                    });
            });

        it('should allow full balance withdrawal',
            async () => {
                const balanceBeforeWithdrawal: any = await promisify(
                    cb => web3.eth.getBalance(user1, cb));

                await depositReceiverContract
                    .withdraw(singleDepositAmount, {from: user1});

                const balanceAfterWithdrawal: any = await promisify(
                    cb => web3.eth.getBalance(user1, cb));

                assert.isTrue(
                    balanceAfterWithdrawal
                        .sub(balanceBeforeWithdrawal)
                        .greaterThan(0));
            });

        it('should subtract withdrawn amount from user balance',
            async () => {
                await depositReceiverContract
                    .withdraw(singleDepositAmount, {from: user1});

                const balance = await depositReceiverContract
                    .getBalance({from: user1});

                assertNumberEqual(balance, zeroAmount);
            });
    });
});
