import { Schema, model, models } from "mongoose";

const VisitCountSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  count: { type: Number, default: 0 },
});

export const VisitCount =
  models.VisitCount ?? model("VisitCount", VisitCountSchema);
