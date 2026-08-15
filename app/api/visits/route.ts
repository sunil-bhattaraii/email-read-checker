import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VisitCount } from "@/models/VisitCount";

const SITE_KEY = "site";
const VISIT_COOKIE = "hasVisited";
const VISIT_COOKIE_MAX_AGE = 60 * 60;

export async function POST(req: Request) {
  try {
    const hasVisited = Boolean(
      req.headers.get("cookie")?.split(";").some((c) => c.trim().startsWith(`${VISIT_COOKIE}=`))
    );
    await connectDB();
    let count: number | null;
    if (!hasVisited) {
      const doc = await VisitCount.findOneAndUpdate(
        { key: SITE_KEY },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
      );
      count = doc?.count ?? null;
    } else {
      const doc = await VisitCount.findOne({ key: SITE_KEY }).lean();
      count = doc?.count ?? null;
    }
    const res = NextResponse.json({ count });
    if (!hasVisited) {
      res.cookies.set(VISIT_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: VISIT_COOKIE_MAX_AGE,
      });
    }
    return res;
  } catch {
    return NextResponse.json({ count: null });
  }
}
