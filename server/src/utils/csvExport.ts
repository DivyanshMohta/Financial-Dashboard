import { createObjectCsvWriter } from "csv-writer";
import { ITransaction } from "../models/Transaction";

export const generateCSV = async (transactions: ITransaction[], columns: string[]) => {
  // Define the CSV headers based on selected columns
  const headers = columns.map(column => ({
    id: column,
    title: column.charAt(0).toUpperCase() + column.slice(1) 
  }));

  // Create CSV writer
  const csvWriter = createObjectCsvWriter({
    path: "temp_transactions.csv",
    header: headers
  });

  // Prepare data for CSV (only include selected columns)
  const csvData = transactions.map(transaction => {
    const row: any = {};
    columns.forEach(column => {
      row[column] = transaction[column as keyof ITransaction];
    });
    return row;
  });

  // Write to CSV file
  await csvWriter.writeRecords(csvData);
  
  return "temp_transactions.csv";
};