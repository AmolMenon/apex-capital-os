import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ScreenshotProvider } from "@/components/ScreenshotProvider";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Apex Capital OS",
  description: "Enterprise Readiness Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} font-sans bg-background text-foreground tracking-tight selection:bg-primary/20 selection:text-primary`} suppressHydrationWarning>
        <AuthProvider>
          <ScreenshotProvider>
            {children}
          </ScreenshotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
