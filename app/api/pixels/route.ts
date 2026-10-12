import { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { connectDB } from "@/lib/db";
import { Pixel } from "@/models/Pixel";
import { getSessionUser } from "@/lib/auth";
import type { Pixel as PixelType } from "@/lib/types";

function serializePixel(pixel: {
  pixelId: string;
  purpose: string;
  opens: number;
  lastOpenedAt: Date | null;
  createdAt: Date;
}): PixelType {
  return {
    pixelId: pixel.pixelId,
    purpose: pixel.purpose,
    opens: pixel.opens ?? 0,
    lastOpenedAt: pixel.lastOpenedAt ? pixel.lastOpenedAt.toISOString() : null,
    createdAt: pixel.createdAt.toISOString(),
  };
}

function baseUrl(req: Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET() {
  await connectDB();
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const pixels = await Pixel.find({ user: user.id })
    .sort({ createdAt: -1 })
    .select("pixelId purpose opens lastOpenedAt createdAt")
    .lean()
    .exec();
  return Response.json({ pixels });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { purpose?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const purpose = (body.purpose ?? "").trim();
  if (!purpose) {
    return Response.json({ error: "Purpose is required." }, { status: 400 });
  }
  if (purpose.length > 120) {
    return Response.json(
      { error: "Purpose must be under 120 characters." },
      { status: 400 }
    );
  }

  const pixel = await Pixel.create({
    pixelId: randomBytes(6).toString("base64url"),
    user: user.id,
    purpose,
  });

  return Response.json(
    {
      pixel: serializePixel(pixel),
      url: `${baseUrl(req)}/p/${pixel.pixelId}`,
    },
    { status: 201 }
  );
}
