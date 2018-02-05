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
const chai_1 = require("chai");
const helpers_1 = require("./helpers");
const DatabaseContract = artifacts.require('./Database.sol');
contract('DatabaseBase', accounts => {
    let dContract;
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        dContract = yield DatabaseContract.new();
    }));
    describe('"#ctor', () => {
        it('should successfully create contract', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isNotNull(dContract);
        }));
    });
    describe('#addressAddition', () => {
        it('should allow to add addresses', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
        }));
        it('should disallow adding duplicate addresses', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield dContract.registerAddress(user1);
            }));
        }));
    });
    describe('#addressDeletion', () => {
        it('should allow to delete an address', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.deRegisterAddress(user1);
            chai_1.assert.isFalse(yield dContract.isAddressRegistered(user1));
        }));
        it('should revert when attempted to de-register not registered address', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield dContract.deRegisterAddress(user1);
            }));
        }));
    });
    describe('#registrationStatus', () => {
        it('should correctly report registered addresses', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            chai_1.assert.isTrue(yield dContract.isAddressRegistered(user1));
        }));
        it('should correctly report not registered addresses', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isFalse(yield dContract.isAddressRegistered(user1));
        }));
        it('should correctly report status after insertion and deletion', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            chai_1.assert.isTrue(yield dContract.isAddressRegistered(user1));
            yield dContract.deRegisterAddress(user1);
            chai_1.assert.isFalse(yield dContract.isAddressRegistered(user1));
        }));
    });
    describe('#addressesListing', () => {
        it('on initialisation should list empty list', () => __awaiter(this, void 0, void 0, function* () {
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, []);
        }));
        it('should return registered address', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user1]);
        }));
        it('should return multiple registered addresses', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user3, user2, user1]);
        }));
        it('should correctly return addresses after deletion of the first', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            yield dContract.deRegisterAddress(user1);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user3, user2]);
        }));
        it('should correctly return addresses after deletion of the last', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            yield dContract.deRegisterAddress(user3);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user2, user1]);
        }));
        it('should correctly return addresses after deletion of the middle', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            yield dContract.deRegisterAddress(user2);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user3, user1]);
        }));
        it('should correctly return addresses after multiple operations', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            yield dContract.deRegisterAddress(user1);
            yield dContract.registerAddress(user1);
            yield dContract.deRegisterAddress(user2);
            yield dContract.deRegisterAddress(user3);
            yield dContract.registerAddress(user3);
            yield dContract.deRegisterAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user1);
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, [user1, user2, user3]);
        }));
    });
    describe('#batchAddressDeletion', () => {
        it('should delete all registered addresses', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.deRegisterAll();
            chai_1.assert.isFalse(yield dContract.isAddressRegistered(user1));
            chai_1.assert.isFalse(yield dContract.isAddressRegistered(user2));
        }));
        it('should not list any addresses after deletion', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.deRegisterAll();
            const addressesList = yield dContract.getAllAddresses();
            chai_1.assert.deepEqual(addressesList, []);
        }));
    });
});
