import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ScreenshotProvider } from "@/components/ScreenshotProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalAssistantBar } from "@/components/assistant/GlobalAssistantBar";
import { SmartInsightsWidget } from "@/components/ui/SmartInsightsWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Capital | Analyst OS",
  description: "Institutional-grade venture capital analyst platform.",
};

import { GlobalPortfolioProvider } from "@/components/GlobalPortfolioProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-JR9STX7Q4P" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JR9STX7Q4P');
          `}
        </Script>
        <div className="bg-rose-600 text-white text-xs font-bold uppercase tracking-widest text-center py-1 relative z-50">
          VC Showcase Demo: Simulated Environment & Mock Data
        </div>
        <GlobalPortfolioProvider>
          <AuthProvider>
          <ScreenshotProvider>
            <OnboardingModal />
            <CommandPalette />
            <div className="flex h-[100dvh] overflow-hidden bg-background">
              <div className="hidden md:flex">
                <Sidebar />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden w-full max-w-full">
              <TopNav />
              <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col relative w-full">
                <div className="flex-1 w-full max-w-full">
                  {children}
                </div>
                <footer className="w-full border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 text-center mt-auto">
                  <p className="text-xs text-muted-foreground/70 max-w-4xl mx-auto leading-relaxed">
                    <strong>Apex Capital</strong> is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs run in mock mode by default unless real providers are configured.
                  </p>
                </footer>
              </main>
              </div>
              <GlobalAssistantBar />
            </div>
          </ScreenshotProvider>
        </AuthProvider>
        </GlobalPortfolioProvider>
        <SmartInsightsWidget />
      </body>
    </html>
  );
}
