import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { getSessionUser } from "@/lib/auth";

const PIXEL_ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;
const MAX_BATCH = 200;

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { pixels?: { pixelId?: string; purpose?: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = (Array.isArray(body.pixels) ? body.pixels : []).slice(
    0,
    MAX_BATCH
  );

  let synced = 0;
  for (const item of items) {
    const pixelId = (item.pixelId ?? "").trim();
    const purpose = (item.purpose ?? "").trim();
    if (!PIXEL_ID_PATTERN.test(pixelId)) continue;
    if (!purpose || purpose.length > 120) continue;
    try {
      const result = await Pixel.updateOne(
        { pixelId, user: null },
        { $set: { user: user.id, purpose } },
        { upsert: true }
      ).exec();
      if (result.upsertedCount > 0 || result.modifiedCount > 0) synced += 1;
    } catch {
      // Skip on conflict, keep syncing the rest.
    }
  }

  return Response.json({ synced });
}
