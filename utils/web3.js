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
const common_1 = require("./common");
class Web3Utils {
    constructor(web3) {
        this.web3 = web3;
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return common_1.promisify(cb => this.web3.eth.getBlockNumber(cb));
        });
    }
    getBalance(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return common_1.promisify(cb => this.web3.eth.getBalance(account, cb));
        });
    }
}
exports.Web3Utils = Web3Utils;
