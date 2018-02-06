"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const chai_1 = require("chai");
const utils_1 = require("../utils");
const common_1 = require("../utils/common");
const helpers_1 = require("./helpers");
const DatabaseContract = artifacts.require('./Database.sol');
const DepositReceiverContract = artifacts.require('./DepositReceiver.sol');
contract('DepositReceiver', accounts => {
    let dContract;
    let depositReceiverContract;
    const user1 = accounts[1];
    const user2 = accounts[2];
    const zeroAmount = new bignumber_js_1.default(0);
    const singleDepositAmount = utils_1.fromEth(0.1);
    const doubleDepositAmount = singleDepositAmount.mul(2);
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        dContract = yield DatabaseContract.new();
        depositReceiverContract
            = yield DepositReceiverContract.new(dContract.address);
    }));
    describe('#ctor', () => {
        it('should successfully create new deposit receiver contract', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isNotNull(depositReceiverContract);
        }));
    });
    describe('#deposit', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
        }));
        it('should allow deposits from accounts registered in database', () => __awaiter(this, void 0, void 0, function* () {
            yield depositReceiverContract
                .deposit({
                from: user1,
                value: singleDepositAmount
            });
            const balanceAfterDeposit = yield depositReceiverContract.getBalance({ from: user1 });
            helpers_1.assertNumberEqual(balanceAfterDeposit, singleDepositAmount);
        }));
        it('should revert deposits not registered in database', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield depositReceiverContract
                    .deposit({
                    from: user2,
                    value: singleDepositAmount
                });
            }));
        }));
        it('should accept deposits sent to fallback function', () => __awaiter(this, void 0, void 0, function* () {
            yield depositReceiverContract
                .sendTransaction({
                from: user1,
                value: singleDepositAmount
            });
            const balanceAfterDeposit = yield depositReceiverContract.getBalance({ from: user1 });
            helpers_1.assertNumberEqual(balanceAfterDeposit, singleDepositAmount);
        }));
    });
    describe('#balance', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
        }));
        it('should revert when asked for balance of not registered address', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield depositReceiverContract.getBalance({ from: user2 });
            }));
        }));
        it('should report empty for newly registered addresses', () => __awaiter(this, void 0, void 0, function* () {
            const accountBalance = yield depositReceiverContract
                .getBalance({ from: user1 });
            helpers_1.assertNumberEqual(accountBalance, new bignumber_js_1.default(0));
        }));
        it('should correctly report address balance', () => __awaiter(this, void 0, void 0, function* () {
            yield depositReceiverContract
                .deposit({
                from: user1,
                value: singleDepositAmount
            });
            const accountBalance = yield depositReceiverContract.getBalance({ from: user1 });
            helpers_1.assertNumberEqual(accountBalance, new bignumber_js_1.default(singleDepositAmount));
        }));
        it('should correctly report balance after multiple transfers', () => __awaiter(this, void 0, void 0, function* () {
            yield depositReceiverContract
                .deposit({
                from: user1,
                value: singleDepositAmount
            });
            yield depositReceiverContract
                .deposit({
                from: user1,
                value: singleDepositAmount
            });
            const accountBalance = yield depositReceiverContract.getBalance({ from: user1 });
            helpers_1.assertNumberEqual(accountBalance, doubleDepositAmount);
        }));
    });
    describe('#withdraw', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield depositReceiverContract
                .deposit({
                from: user1,
                value: singleDepositAmount
            });
        }));
        it('should revert withdrawals for addresses not in database', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.deRegisterAddress(user1);
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield depositReceiverContract
                    .withdraw(singleDepositAmount, { from: user1 });
            }));
        }));
        it('should revert empty withdrawals', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield depositReceiverContract
                    .withdraw(zeroAmount, { from: user1 });
            }));
        }));
        it('should not allow withdrawals exceeding deposited amount', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield depositReceiverContract
                    .withdraw(doubleDepositAmount, { from: user1 });
            }));
        }));
        it('should allow full balance withdrawal', () => __awaiter(this, void 0, void 0, function* () {
            const balanceBeforeWithdrawal = yield common_1.promisify(cb => web3.eth.getBalance(user1, cb));
            yield depositReceiverContract
                .withdraw(singleDepositAmount, { from: user1 });
            const balanceAfterWithdrawal = yield common_1.promisify(cb => web3.eth.getBalance(user1, cb));
            chai_1.assert.isTrue(balanceAfterWithdrawal
                .greaterThan(balanceBeforeWithdrawal));
        }));
        it('should subtract withdrawn amount from user balance', () => __awaiter(this, void 0, void 0, function* () {
            yield depositReceiverContract
                .withdraw(singleDepositAmount, { from: user1 });
            const balance = yield depositReceiverContract
                .getBalance({ from: user1 });
            helpers_1.assertNumberEqual(balance, zeroAmount);
        }));
    });
});
