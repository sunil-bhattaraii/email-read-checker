import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import {
  hashPassword,
  verifyPassword,
  validateUsername,
  validatePassword,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  const usernameError = validateUsername(username);
  if (usernameError) {
    return Response.json({ error: usernameError }, { status: 400 });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return Response.json({ error: passwordError }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ username }).exec();

  if (existing) {
    const ok = await verifyPassword(password, existing.passwordHash);
    if (!ok) {
      return Response.json({ error: "Wrong password." }, { status: 401 });
    }
    await setSessionCookie(String(existing._id));
    return Response.json({ username: existing.username });
  }

  const user = await User.create({
    username,
    passwordHash: await hashPassword(password),
  });
  await setSessionCookie(String(user._id));
  return Response.json({ username: user.username }, { status: 201 });
}
