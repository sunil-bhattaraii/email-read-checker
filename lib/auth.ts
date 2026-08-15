import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import type { SessionUser } from "@/lib/types";

export const SESSION_COOKIE = "erc_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Add it to your .env file.");
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validateUsername(username: string): string | null {
  if (username.length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return "Username can only contain letters, numbers, dots, dashes and underscores.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  await connectDB();
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getSecret()) as { sub?: string };
    if (!payload.sub) return null;
    const user = await User.findById(payload.sub)
      .select("username")
      .lean()
      .exec();
    if (!user) return null;
    return { id: String(user._id), username: user.username };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

function signSession(userId: string): string {
  return jwt.sign({ sub: userId }, getSecret(), {
    expiresIn: SESSION_MAX_AGE,
  });
}
