import { NextRequest, after } from "next/server";
import { connectDB } from "@/lib/db";
import { countView } from "@/lib/track-view";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  after(async () => {
    try {
      await connectDB({ timeoutMS: 2000 });
      await countView(req, id);
    } catch {
      // Never fail tracking even if the database is slow or down.
    }
  });

  return new Response(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}