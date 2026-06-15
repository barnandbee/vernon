import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_GB_S_Guides } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import SiteGate from "@/components/SiteGate";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playwrite = Playwrite_GB_S_Guides({ variable: "--font-playwrite-gb-s-guides", weight: "400" });

export const metadata: Metadata = {
  title: "Vernon — Your Career Coaching Platform",
  description: "Personalised career coaching, reflections, and guidance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playwrite.variable} h-full`}>
      <body className="min-h-full antialiased">
        <SiteGate>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SiteGate>
      </body>
    </html>
  );
}
