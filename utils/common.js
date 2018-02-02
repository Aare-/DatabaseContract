"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisify(fn) {
    return new Promise((resolve, reject) => fn((err, res) => {
        if (err) {
            return reject(err);
        }
        return resolve(res);
    }));
}
exports.promisify = promisify;
