import { getSessionUser } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSessionUser();
  return <Dashboard key={user?.id ?? "guest"} user={user} />;
}
