import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

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
