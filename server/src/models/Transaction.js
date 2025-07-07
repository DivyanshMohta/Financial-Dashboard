"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    id: { type: Number, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    user_id: { type: String, required: true },
    user_profile: { type: String, required: true },
}, { collection: "transactions" });
exports.default = mongoose_1.default.model("Transaction", TransactionSchema);
