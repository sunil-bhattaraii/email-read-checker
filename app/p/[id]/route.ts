import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { getSessionUser, SESSION_COOKIE } from "@/lib/auth";
import { GUEST_OWNED_COOKIE } from "@/lib/guest";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB({ timeoutMS: 2000 });
    const skip = await shouldSkipCount(req, id);
    if (!skip) {
      await Pixel.findOneAndUpdate(
        { pixelId: id },
        {
          $inc: { opens: 1 },
          $set: { lastOpenedAt: new Date() },
          $setOnInsert: { purpose: "" },
        },
        { upsert: true }
      ).exec();
    }
  } catch {
    // Never fail the image load even if tracking is down.
  }
  return new Response(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

async function shouldSkipCount(req: NextRequest, pixelId: string) {
  const guestOwned = req.cookies.get(GUEST_OWNED_COOKIE)?.value;
  if (guestOwned && guestOwned.split(",").includes(pixelId)) return true;
  if (!req.cookies.get(SESSION_COOKIE)) return false;
  const user = await getSessionUser();
  if (!user) return false;
  const pixel = await Pixel.findOne({ pixelId }).select("user").lean().exec();
  return Boolean(pixel && String(pixel.user) === user.id);
}
