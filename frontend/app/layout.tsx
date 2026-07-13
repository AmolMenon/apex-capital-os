import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ScreenshotProvider } from "@/components/ScreenshotProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Apex | AI Fundraising Intelligence",
  description: "Know exactly how VCs will evaluate you. Before you pitch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground`} suppressHydrationWarning>
        <AuthProvider>
          <ScreenshotProvider>
            {children}
          </ScreenshotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
