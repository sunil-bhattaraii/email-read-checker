import { NextRequest } from "next/server";
import { Pixel } from "@/models/Pixel";
import { ViewLock } from "@/models/ViewLock";
import { ViewBucket } from "@/models/ViewBucket";
import { getSessionUser, SESSION_COOKIE } from "@/lib/auth";
import { GUEST_OWNED_COOKIE } from "@/lib/guest";
import { getClientIp, hashIp, VIEW_WINDOW_MS } from "@/lib/ip";
import { hourKey } from "@/lib/buckets";

export async function countView(
  req: NextRequest,
  pixelId: string
): Promise<boolean> {
  if (await shouldSkipOwnerPreview(req, pixelId)) return false;
  if (!(await shouldCountIp(req, pixelId))) return false;
  const now = new Date();
  await Pixel.findOneAndUpdate(
    { pixelId },
    {
      $inc: { opens: 1 },
      $set: { lastOpenedAt: now },
      $setOnInsert: { purpose: "" },
    },
    { upsert: true }
  ).exec();
  await ViewBucket.updateOne(
    { pixelId, hour: hourKey(now) },
    { $inc: { count: 1 }, $set: { at: now } },
    { upsert: true }
  ).exec();
  return true;
}

async function shouldSkipOwnerPreview(
  req: NextRequest,
  pixelId: string
): Promise<boolean> {
  const guestOwned = req.cookies.get(GUEST_OWNED_COOKIE)?.value;
  if (guestOwned && guestOwned.split(",").includes(pixelId)) return true;
  if (!req.cookies.get(SESSION_COOKIE)) return false;
  const user = await getSessionUser();
  if (!user) return false;
  const pixel = await Pixel.findOne({ pixelId }).select("user").lean().exec();
  return Boolean(pixel && String(pixel.user) === user.id);
}

async function shouldCountIp(
  req: NextRequest,
  pixelId: string
): Promise<boolean> {
  const ip = getClientIp(req);
  if (!ip) return true;

  const now = new Date();
  const key = `${pixelId}:${hashIp(ip)}`;
  const lock = await ViewLock.findOne({ key })
    .select("lastCountedAt")
    .lean()
    .exec();
  if (
    lock &&
    now.getTime() - new Date(lock.lastCountedAt).getTime() < VIEW_WINDOW_MS
  ) {
    return false;
  }

  await ViewLock.updateOne(
    { key },
    { $set: { pixelId, lastCountedAt: now } },
    { upsert: true }
  ).exec();
  return true;
}