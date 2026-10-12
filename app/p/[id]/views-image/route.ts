import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import {
  isViewsImageTheme,
  renderViewsImage,
} from "@/lib/views-image";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const themeParam = new URL(req.url).searchParams.get("theme");
  const theme = isViewsImageTheme(themeParam) ? themeParam : "light";

  let views = 0;
  try {
    await connectDB({ timeoutMS: 2000 });
    const pixel = await Pixel.findOne({ pixelId: id })
      .select("opens")
      .lean()
      .exec();
    views = pixel?.opens ?? 0;
  } catch {
    // Fall back to zero views if tracking is unavailable.
  }

  return new Response(renderViewsImage(views, theme), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
