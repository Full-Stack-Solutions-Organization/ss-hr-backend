import mongoose, { Schema, Document } from "mongoose";

interface ICounter extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel = mongoose.model<ICounter>("Counter", CounterSchema);
