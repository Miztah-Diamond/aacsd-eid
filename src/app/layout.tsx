import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { ORG } from "@/lib/org";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: `${ORG.shortName} Membership E-ID`,
  description: `${ORG.fullName} digital membership verification`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
