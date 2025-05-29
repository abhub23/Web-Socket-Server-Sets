"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomID = void 0;
const crypto_1 = require("crypto");
const createRoomID = () => {
    return (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
};
exports.createRoomID = createRoomID;
