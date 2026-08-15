import { Schema, model, models } from "mongoose";

const PixelSchema = new Schema(
  {
    pixelId: { type: String, required: true, unique: true, index: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    purpose: { type: String, default: "", trim: true },
    opens: { type: Number, default: 0 },
    lastOpenedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Pixel = models.Pixel ?? model("Pixel", PixelSchema);
