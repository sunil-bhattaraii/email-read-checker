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
      <LoginForm />
    </main>
  );
}
