"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetBlockTime = 15;
function secondsToBlocks(seconds) {
    return Math.ceil(seconds / exports.targetBlockTime);
}
exports.secondsToBlocks = secondsToBlocks;
function minutesToBlocks(minutes) {
    return secondsToBlocks(minutes * 60);
}
exports.minutesToBlocks = minutesToBlocks;
function hoursToBlocks(hours) {
    return minutesToBlocks(hours * 60);
}
exports.hoursToBlocks = hoursToBlocks;
function daysToBlocks(days) {
    return hoursToBlocks(days * 24);
}
exports.daysToBlocks = daysToBlocks;
