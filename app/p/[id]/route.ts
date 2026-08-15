import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    await Pixel.findOneAndUpdate(
      { pixelId: id },
      {
        $inc: { opens: 1 },
        $set: { lastOpenedAt: new Date() },
        $setOnInsert: { purpose: "" },
      },
      { upsert: true }
    ).exec();
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
