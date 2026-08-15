import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { incrementVisitCount } from "@/lib/visitCount";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Email Read Checker",
  description: "Track when your emails are opened with an invisible tracking pixel.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const visits = await incrementVisitCount();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        {children}
        <Footer visits={visits} />
      </body>
    </html>
  );
}
