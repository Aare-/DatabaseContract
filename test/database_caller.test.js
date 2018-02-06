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
const DatabaseCallerContract = artifacts.require('./DatabaseCaller.sol');
const DatabaseContract = artifacts.require('./Database.sol');
contract('DatabaseCaller', accounts => {
    let dbCallerContract;
    let dContract;
    let anotherDContract;
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        dContract = yield DatabaseContract.new();
        dbCallerContract = yield DatabaseCallerContract.new();
    }));
    describe('#ctor', () => {
        it('should successfully create new database caller contract', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isNotNull(dbCallerContract);
        }));
    });
    describe('#collectData', () => {
        it('should correctly collect data from empty database', () => __awaiter(this, void 0, void 0, function* () {
            const addressesList = yield dbCallerContract.collectData(dContract.address);
            chai_1.assert.deepEqual(addressesList, []);
        }));
        it('should correctly collect data from populated database', () => __awaiter(this, void 0, void 0, function* () {
            yield dContract.registerAddress(user1);
            yield dContract.registerAddress(user2);
            yield dContract.registerAddress(user3);
            const addressesList = yield dbCallerContract.collectData(dContract.address);
            chai_1.assert.deepEqual(addressesList, [user3, user2, user1]);
        }));
        it('should correctly collect data from different databases', () => __awaiter(this, void 0, void 0, function* () {
            anotherDContract = yield DatabaseContract.new();
            yield dContract.registerAddress(user1);
            yield anotherDContract.registerAddress(user2);
            const addressesList1 = yield dbCallerContract
                .collectData(dContract.address);
            const addressesList2 = yield dbCallerContract
                .collectData(anotherDContract.address);
            chai_1.assert.deepEqual(addressesList1, [user1]);
            chai_1.assert.deepEqual(addressesList2, [user2]);
        }));
    });
});
