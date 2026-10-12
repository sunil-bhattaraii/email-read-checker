import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ReadMail",
  description:
    "Track views of anything with an invisible 1x1 tracking counter.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const user = await getSessionUser();
  return <Dashboard key={user?.id ?? "guest"} user={user} />;
}
