import type { Metadata } from "next";
import "./globals.css";
import "@nfsfu234/form-validation/css";


export const metadata: Metadata = {
  metadataBase: new URL("https://formvalidation.nforshifu234dev.com"),

  title: {
    default: "Next.js Playground | NFSFU234 Form Validation",
    template: "%s | NFSFU234 Form Validation",
  },

  description:
    "Official Next.js compatibility playground for NFSFU234 Form Validation. Test validation, password utilities, AJAX submission, TypeScript support, CSS imports, and framework integration.",

  keywords: [
    "NFSFU234 Form Validation",
    "Next.js",
    "TypeScript",
    "Form Validation",
    "React",
    "JavaScript",
    "Validation Library",
    "Playground",
    "npm",
  ],

  authors: [
    {
      name: "NFORSHIFU234 Dev",
      url: "https://www.nforshifu234dev.com",
    },
  ],

  creator: "NFORSHIFU234 Dev",

  publisher: "NFORSHIFU234 Dev",

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Next.js Playground | NFSFU234 Form Validation",
    description:
      "Official compatibility playground for the NFSFU234 Form Validation library.",
    type: "website",
    locale: "en_US",
    siteName: "NFSFU234 Form Validation",
  },

  twitter: {
    card: "summary_large_image",
    title: "Next.js Playground | NFSFU234 Form Validation",
    description:
      "Official compatibility playground for the NFSFU234 Form Validation library.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}