import { Schema, model, models } from "mongoose";

const ViewBucketSchema = new Schema({
  pixelId: { type: String, required: true, index: true },
  hour: { type: String, required: true },
  count: { type: Number, default: 0 },
  at: { type: Date, required: true },
});

ViewBucketSchema.index({ pixelId: 1, hour: 1 }, { unique: true });
ViewBucketSchema.index({ at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 120 });

export const ViewBucket =
  models.ViewBucket ?? model("ViewBucket", ViewBucketSchema);
