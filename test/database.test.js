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
const assert = require("assert");
const helpers_1 = require("./helpers");
const DatabaseContract = artifacts.require('./Database.sol');
contract('Database', accounts => {
    const user1 = accounts[1];
    const user2 = accounts[2];
    function createContract() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseContract.new();
        });
    }
    describe("#ctor", () => {
        it('should successfully create contract', () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield createContract();
            assert.equal(contract != null, true);
        }));
    });
    describe("#addressAddition", () => {
        it('should allow to add addresses', () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield createContract();
            assert.equal(yield contract.registerAddress(user1), true);
        }));
        it('should disallow adding duplicate addresses', () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield createContract();
            assert.equal(yield contract.registerAddress(user2), true);
            assert.equal(yield contract.registerAddress(user2), false);
        }));
        it('should revert if empty address is provided', () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield createContract();
            const emptyAddress = '';
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield contract.registerAddress(emptyAddress);
            }));
        }));
        it('should revert if incorrect address is provided', () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield createContract();
            const incorrectAddress = 'veryIncorrectAddress';
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield contract.registerAddress(incorrectAddress);
            }));
        }));
    });
});
