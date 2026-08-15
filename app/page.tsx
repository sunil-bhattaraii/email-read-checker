import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return <Dashboard username={user.username} />;
}
