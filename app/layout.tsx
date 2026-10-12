import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL ?? "https://readmail.sunil-bhattarai.com.np"
  ),
  title: {
    default: "ReadMail",
    template: "%s | ReadMail",
  },
  description:
    "Track views of anything with a simple embeddable counter.",
  applicationName: "ReadMail",
  manifest: "/assets/favicons/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      "Track views of anything with a simple embeddable counter.",
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
      "Track views of anything with a simple embeddable counter.",
    images: ["/assets/readmail-logo.png"],
  },
};

const themeScript = `(function(){try{var k="theme";var s=localStorage.getItem(k);var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteUrl =
    process.env.APP_URL ?? "https://readmail.sunil-bhattarai.com.np";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ReadMail",
    url: siteUrl,
    description:
      "Track views of anything with a simple embeddable counter.",
  };
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
