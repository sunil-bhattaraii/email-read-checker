import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ReadMail",
  description:
    "Track when your emails are opened with an invisible tracking pixel. Create a pixel, paste it into an email, and watch the open count grow.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const user = await getSessionUser();
  return <Dashboard key={user?.id ?? "guest"} user={user} />;
}
