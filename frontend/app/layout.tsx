import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkspaceNav } from "@/components/workspace/WorkspaceNav";
import { CommandPalette } from "@/components/CommandPalette";
import { AuthProvider } from "@/context/AuthContext";
import { TopNav } from "@/components/TopNav";
import ModeIndicator from "@/components/ui/ModeIndicator";
import { ScreenshotProvider } from "@/components/ScreenshotProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex | Decision Intelligence OS",
  description: "AI-powered operating system for high-stakes decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-50`} suppressHydrationWarning>
        {/* Clean layout for presentation */}
        <ModeIndicator />
        <AuthProvider>
          <ScreenshotProvider>
            <CommandPalette />
            <div className="flex h-[100dvh] overflow-hidden bg-slate-950">
              <div className="hidden md:flex">
                <WorkspaceNav />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden w-full max-w-full md:ml-64">
                <TopNav />
                <main className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative w-full">
                  <div className="flex-1 w-full max-w-full p-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </ScreenshotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
