"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSV = void 0;
const csv_writer_1 = require("csv-writer");
const generateCSV = (transactions, columns) => __awaiter(void 0, void 0, void 0, function* () {
    // Define the CSV headers based on selected columns
    const headers = columns.map(column => ({
        id: column,
        title: column.charAt(0).toUpperCase() + column.slice(1)
    }));
    // Create CSV writer
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: "temp_transactions.csv",
        header: headers
    });
    // Prepare data for CSV (only include selected columns)
    const csvData = transactions.map(transaction => {
        const row = {};
        columns.forEach(column => {
            row[column] = transaction[column];
        });
        return row;
    });
    // Write to CSV file
    yield csvWriter.writeRecords(csvData);
    return "temp_transactions.csv";
});
exports.generateCSV = generateCSV;
