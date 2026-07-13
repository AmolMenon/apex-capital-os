"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DealsService } from "@/services/deals";
import { Deal } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Save } from "lucide-react";

export default function CompanyWorkspacePage() {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const deals = await DealsService.getDeals();
        if (deals && deals.length > 0) {
          setDeal(deals[0]);
        } else {
          router.push("/onboarding");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCompany();
  }, [router]);

  const handleSave = async () => {
    if (!deal) return;
    setSaving(true);
    try {
      await DealsService.updateDeal(deal.id, deal);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Deal, value: any) => {
    if (!deal) return;
    setDeal({ ...deal, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Activity className="w-6 h-6 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  if (!deal) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-end justify-between border-b border-border pb-4 sticky top-0 bg-background/95 backdrop-blur z-10 pt-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Company Workspace</h1>
          <p className="text-muted-foreground mt-1">Manage your narrative and metrics.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-24">
          {saving ? <Activity className="w-4 h-4 animate-pulse" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
        </Button>
      </div>

      <div className="space-y-8 pb-12">
        {/* Company Profile */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/50 pb-2">Profile & Round</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input 
                value={deal.startup_name || ""} 
                onChange={(e) => updateField("startup_name", e.target.value)} 
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input 
                value={deal.website || ""} 
                onChange={(e) => updateField("website", e.target.value)} 
                className="bg-card"
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Raise ($)</label>
              <Input 
                type="number"
                value={deal.funding_raised || ""} 
                onChange={(e) => updateField("funding_raised", Number(e.target.value))} 
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Valuation ($)</label>
              <Input 
                type="number"
                value={deal.valuation || ""} 
                onChange={(e) => updateField("valuation", Number(e.target.value))} 
                className="bg-card"
              />
            </div>
          </div>
        </section>

        {/* Narrative */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/50 pb-2">Narrative</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">One-Line Pitch</label>
              <Input 
                value={deal.description || ""} 
                onChange={(e) => updateField("description", e.target.value)} 
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem & Solution</label>
              <Textarea 
                value={deal.notes || ""} 
                onChange={(e) => updateField("notes", e.target.value)} 
                className="bg-card min-h-[100px]"
                placeholder="Describe the problem you are solving..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Competition</label>
              <Textarea 
                value={deal.competitors || ""} 
                onChange={(e) => updateField("competitors", e.target.value)} 
                className="bg-card min-h-[80px]"
              />
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/50 pb-2">Traction & Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ARR / Revenue ($)</label>
              <Input 
                type="number"
                value={deal.revenue || ""} 
                onChange={(e) => updateField("revenue", Number(e.target.value))} 
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Users / Customers</label>
              <Input 
                type="number"
                value={deal.users || ""} 
                onChange={(e) => updateField("users", Number(e.target.value))} 
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Market Size (TAM)</label>
              <Input 
                type="number"
                value={deal.market_size || ""} 
                onChange={(e) => updateField("market_size", Number(e.target.value))} 
                className="bg-card"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
