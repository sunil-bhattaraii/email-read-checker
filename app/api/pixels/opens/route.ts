import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";

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
  const pixels = await Pixel.find({ pixelId: { $in: ids } })
    .select("pixelId opens lastOpenedAt")
    .lean()
    .exec();
  return Response.json({ pixels });
}
