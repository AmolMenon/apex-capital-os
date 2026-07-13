"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Files, 
  CheckCircle2, 
  Settings,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Deck", href: "/dashboard/deck", icon: Files },
    { name: "Tasks", href: "/dashboard/execution-workspace", icon: CheckCircle2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-60 flex-shrink-0 border-r border-border/50 bg-background flex flex-col pt-4">
        <div className="px-6 pb-6 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
            A
          </div>
          <span className="font-semibold text-sm tracking-tight">Apex</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-[2px] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-foreground" : "text-muted-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-border/50">
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-foreground">
                F
              </div>
              Founder
            </div>
            <MoreHorizontal className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-background">
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
