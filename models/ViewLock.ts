import { Schema, model, models } from "mongoose";

const ViewLockSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  pixelId: { type: String, required: true, index: true },
  lastCountedAt: { type: Date, required: true },
});

ViewLockSchema.index({ lastCountedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export const ViewLock = models.ViewLock ?? model("ViewLock", ViewLockSchema);
