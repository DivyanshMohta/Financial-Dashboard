import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  id: { type: Number, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  user_id: { type: String, required: true },
  user_profile: { type: String, required: true },
}, { collection: "transactions" });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);