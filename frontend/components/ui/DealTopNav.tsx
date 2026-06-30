"use client";

import Link from "next/link";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { CollaborationDrawer } from "@/components/ui/CollaborationDrawer";

export function DealTopNav() {
  const { isPartnerMode, togglePartnerMode } = useGlobalDeal();

  return (
    <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <nav className="flex items-center gap-4 text-sm font-medium">
        <Link href="/pipeline" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Pipeline
        </Link>
      </nav>
      <div className="flex items-center space-x-2">
        <Briefcase className={`w-4 h-4 ${isPartnerMode ? 'text-primary' : 'text-muted-foreground'}`} />
        <Label htmlFor="partner-mode" className={`text-sm cursor-pointer ${isPartnerMode ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
          Partner View
        </Label>
        <Switch 
          id="partner-mode" 
          checked={isPartnerMode}
          onCheckedChange={togglePartnerMode}
        />
        <div className="w-px h-6 bg-border/50 mx-2"></div>
        <CollaborationDrawer />
      </div>
    </div>
  );
}
