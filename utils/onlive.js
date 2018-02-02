"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const number_1 = require("./number");
exports.ONL_DECIMALS = 18;
function toONL(num) {
    return number_1.shiftNumber(num, exports.ONL_DECIMALS);
}
exports.toONL = toONL;
function toThousandsONL(num) {
    const thousandDecimals = 3;
    return number_1.shiftNumber(num, thousandDecimals + exports.ONL_DECIMALS);
}
exports.toThousandsONL = toThousandsONL;
function toMillionsONL(num) {
    const millionDecimals = 6;
    return number_1.shiftNumber(num, millionDecimals + exports.ONL_DECIMALS);
}
exports.toMillionsONL = toMillionsONL;
function calculateContribution(eth, price) {
    const value = new bignumber_js_1.BigNumber(eth);
    return number_1.shiftNumber(value, number_1.ETH_DECIMALS).div(price);
}
exports.calculateContribution = calculateContribution;
