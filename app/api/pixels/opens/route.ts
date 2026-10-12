import { NextRequest, after } from "next/server";
import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { maybeFlush } from "@/lib/view-buffer";

const MAX_IDS = 100;

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS);
  if (!ids.length) {
    return Response.json({ pixels: [] });
  }
  await connectDB();
  after(() => {
    maybeFlush().catch(() => {});
  });
  const pixels = await Pixel.find({ pixelId: { $in: ids } })
    .select("pixelId opens lastOpenedAt")
    .lean()
    .exec();
  return Response.json({ pixels });
}
