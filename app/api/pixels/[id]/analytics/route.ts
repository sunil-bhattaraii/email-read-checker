import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { ViewBucket } from "@/models/ViewBucket";
import { getSessionUser } from "@/lib/auth";

const HOURS = 48;
const DAYS = 90;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  const pixel = await Pixel.findOne({ pixelId: id }).select("user").lean().exec();
  if (!pixel) {
    return Response.json({ error: "Pixel not found." }, { status: 404 });
  }
  if (pixel.user) {
    const user = await getSessionUser();
    if (!user || String(pixel.user) !== user.id) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const now = new Date();
  const startDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  startDay.setUTCDate(startDay.getUTCDate() - (DAYS - 1));
  const sinceHour = startDay.toISOString().slice(0, 13);

  const buckets = await ViewBucket.find({
    pixelId: id,
    hour: { $gte: sinceHour },
  })
    .select("hour count")
    .lean()
    .exec();

  const hourMap = new Map<string, number>();
  const dayMap = new Map<string, number>();
  for (const b of buckets) {
    hourMap.set(b.hour, (hourMap.get(b.hour) ?? 0) + b.count);
    const day = b.hour.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + b.count);
  }

  const hourStart = new Date(now);
  hourStart.setUTCMinutes(0, 0, 0);
  const hourly: { t: string; count: number }[] = [];
  for (let i = HOURS - 1; i >= 0; i--) {
    const d = new Date(hourStart);
    d.setUTCHours(d.getUTCHours() - i);
    const key = d.toISOString().slice(0, 13);
    hourly.push({ t: key, count: hourMap.get(key) ?? 0 });
  }

  const daily: { d: string; count: number }[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(startDay);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    daily.push({ d: key, count: dayMap.get(key) ?? 0 });
  }

  return Response.json({ pixelId: id, hourly, daily });
}
