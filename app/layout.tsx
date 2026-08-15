import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ReadMail",
    template: "%s | ReadMail",
  },
  description:
    "Track when your emails are opened with an invisible tracking pixel.",
  manifest: "/assets/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/assets/favicons/favicon.ico", sizes: "any" },
      {
        url: "/assets/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/assets/favicons/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "ReadMail",
    description:
      "Track when your emails are opened with an invisible tracking pixel.",
    siteName: "ReadMail",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/readmail-logo.png",
        width: 400,
        height: 400,
        alt: "ReadMail logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ReadMail",
    description:
      "Track when your emails are opened with an invisible tracking pixel.",
    images: ["/assets/readmail-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        {children}
        <Footer />
      </body>
    </html>
  );
}
