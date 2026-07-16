"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Target, 
  Activity, 
  Database,
  Search,
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
    { name: "Briefing", href: "/dashboard", icon: Home },
    { name: "Deals", href: "/dashboard/deals", icon: Target },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: Activity },
    { name: "Memory", href: "/dashboard/memory", icon: Database },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-background flex flex-col">
        {/* Organization Workspace Dropdown */}
        <div className="px-4 py-5 flex items-center justify-between group cursor-pointer hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground">Sequoia Capital</span>
              <span className="text-[11px] text-muted-foreground">Apex OS</span>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
        </div>

        {/* Global Search (Command Menu affordance) */}
        <div className="px-4 mb-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-md text-sm text-muted-foreground transition-colors border border-border/50">
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search deals...</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map((item) => {
            // Active state: Exact match for /dashboard, starts with for others (e.g. /dashboard/deals/1)
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
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
        
        <div className="p-4 border-t border-border/50">
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] text-foreground border">
                P
              </div>
              Partner
            </div>
            <MoreHorizontal className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-background">
        <div className="flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
