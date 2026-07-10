import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkspaceNav } from "@/components/workspace/WorkspaceNav";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
        {/* Clean layout for presentation */}
        <ModeIndicator />
        <AuthProvider>
          <ScreenshotProvider>
            <div className="flex h-[100dvh] overflow-hidden bg-background">
              <div className="hidden md:flex">
                <WorkspaceNav />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden w-full max-w-full md:ml-64">
                <TopNav />
                <main className="flex-1 overflow-y-auto bg-muted/30 flex flex-col relative w-full">
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
