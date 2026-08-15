import { cache } from "react";
import { connectDB } from "./db";
import { VisitCount } from "@/models/VisitCount";

const SITE_KEY = "site";

export const incrementVisitCount = cache(async (): Promise<number | null> => {
  if (process.env.NEXT_PHASE === "phase-production-build") return null;
  try {
    await connectDB();
    const doc = await VisitCount.findOneAndUpdate(
      { key: SITE_KEY },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    return doc?.count ?? null;
  } catch {
    return null;
  }
});
