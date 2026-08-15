import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to ReadMail with your username. New usernames are created on first sign in.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
  }
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <LoginForm />
        <p className="mt-4 text-center text-xs text-neutral-500">
          Pixels you made without signing in are added to your account when you
          sign in.
        </p>
      </div>
    </main>
  );
}
