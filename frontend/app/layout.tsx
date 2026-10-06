import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import EditorialHeader from "@/components/layout/EditorialHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROOF — Demonstrated Technical Capability Platform",
  description: "Don't tell us what you can do. Show us what you can prove. Verifiable engineering capabilities, deep architecture reviews, and technical discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-[#F7F7F5] text-[#111111] antialiased selection:bg-[#111111] selection:text-[#FFFFFF]">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Editorial Top Navigation */}
            <EditorialHeader />

            {/* Main Publication Canvas */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
