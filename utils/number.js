"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
exports.ETH_DECIMALS = 18;
function toFinney(eth) {
    return shiftNumber(eth, 3);
}
exports.toFinney = toFinney;
function toSzabo(eth) {
    return shiftNumber(eth, 6);
}
exports.toSzabo = toSzabo;
function toGwei(eth) {
    return shiftNumber(eth, 9);
}
exports.toGwei = toGwei;
function toMwei(eth) {
    return shiftNumber(eth, 12);
}
exports.toMwei = toMwei;
function toKwei(eth) {
    return shiftNumber(eth, 15);
}
exports.toKwei = toKwei;
function toWei(eth) {
    return shiftNumber(eth, exports.ETH_DECIMALS);
}
exports.toWei = toWei;
function fromEth(eth) {
    return shiftNumber(eth, exports.ETH_DECIMALS);
}
exports.fromEth = fromEth;
function fromFinney(finney) {
    return shiftNumber(finney, 15);
}
exports.fromFinney = fromFinney;
function fromSzabo(szabo) {
    return shiftNumber(szabo, 12);
}
exports.fromSzabo = fromSzabo;
function fromGwei(gwei) {
    return shiftNumber(gwei, 9);
}
exports.fromGwei = fromGwei;
function fromMwei(mwei) {
    return shiftNumber(mwei, 6);
}
exports.fromMwei = fromMwei;
function fromKwei(kwei) {
    return shiftNumber(kwei, 3);
}
exports.fromKwei = fromKwei;
function shiftNumber(num, decimals) {
    const factor = new bignumber_js_1.BigNumber(10).pow(decimals);
    return new bignumber_js_1.BigNumber(num).mul(factor);
}
exports.shiftNumber = shiftNumber;
