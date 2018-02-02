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
const ramda_1 = require("ramda");
const utils_1 = require("../utils");
exports.ZERO_ADDRESS = '0x' + '0'.repeat(40);
function assertReverts(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
        }
        catch (error) {
            assertRevertError(error);
            return;
        }
        chai_1.assert.fail({}, {}, 'Should have reverted');
    });
}
exports.assertReverts = assertReverts;
function assertRevertError(error) {
    if (error && error.message) {
        if (error.message.search('revert') === -1) {
            chai_1.assert.fail(error, {}, 'Expected revert error, instead got: ' + error.message);
        }
    }
    else {
        chai_1.assert.fail(error, {}, 'Expected revert error');
    }
}
exports.assertRevertError = assertRevertError;
function assertNumberEqual(actual, expect, decimals = 0) {
    const actualNum = new bignumber_js_1.BigNumber(actual);
    const expectNum = new bignumber_js_1.BigNumber(expect);
    if (!actualNum.eq(expectNum)) {
        const div = decimals ? Math.pow(10, decimals) : 1;
        chai_1.assert.fail(actualNum.toFixed(), expectNum.toFixed(), `${actualNum.div(div).toFixed()} == ${expectNum.div(div).toFixed()}`, '==');
    }
}
exports.assertNumberEqual = assertNumberEqual;
function assertNumberAlmostEqual(actual, expect, epsilon, decimals = 0) {
    const actualNum = new bignumber_js_1.BigNumber(actual);
    const expectNum = new bignumber_js_1.BigNumber(expect);
    const epsilonNum = new bignumber_js_1.BigNumber(epsilon);
    if (actualNum.lessThan(expectNum.sub(epsilonNum)) ||
        actualNum.greaterThan(expectNum.add(epsilonNum))) {
        const div = decimals ? Math.pow(10, decimals) : 1;
        chai_1.assert.fail(actualNum.toFixed(), expectNum.toFixed(), `${actualNum.div(div).toFixed()} == ${expectNum
            .div(div)
            .toFixed()} (precision ${epsilonNum.div(div).toFixed()})`, '==');
    }
}
exports.assertNumberAlmostEqual = assertNumberAlmostEqual;
function assertEtherEqual(actual, expect) {
    return assertNumberEqual(actual, expect, utils_1.ETH_DECIMALS);
}
exports.assertEtherEqual = assertEtherEqual;
function assertTokenEqual(actual, expect) {
    return assertNumberEqual(actual, expect, utils_1.ONL_DECIMALS);
}
exports.assertTokenEqual = assertTokenEqual;
function assertTokenAlmostEqual(actual, expect, epsilon) {
    return assertNumberAlmostEqual(actual, expect, epsilon, utils_1.ONL_DECIMALS);
}
exports.assertTokenAlmostEqual = assertTokenAlmostEqual;
function findLastLog(trans, event) {
    return ramda_1.findLast(ramda_1.propEq('event', event))(trans.logs);
}
exports.findLastLog = findLastLog;
