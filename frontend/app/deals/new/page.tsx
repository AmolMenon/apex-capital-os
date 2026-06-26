"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Save, Briefcase, Zap, Building, Banknote, CircleHelp } from "lucide-react";
import { Deal } from "@/types";
import { useToast } from "@/components/ui/use-toast"; // wait, check if use-toast exists, if not use sonner or standard alert

export default function NewDealPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startup_name: "",
    website: "",
    founder_name: "",
    founder_email: "",
    sector: "",
    stage: "",
    round_size: "",
    valuation: "",
    traction_summary: "",
    customer_summary: "",
    revenue_summary: "",
    why_interesting: "",
    tags: "",
    deal_type: "Primary",
    source: "Manual Entry"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startup_name) {
      alert("Startup Name is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload: any = {
        startup_name: formData.startup_name,
        description: formData.why_interesting || `New manual deal for ${formData.startup_name}`,
        sector: formData.sector || "Unspecified",
        stage: formData.stage || "Unspecified",
        status: "New",
        deal_type: formData.deal_type,
        website: formData.website,
        founder_name: formData.founder_name,
        founder_email: formData.founder_email,
        round_size: formData.round_size,
        traction_summary: formData.traction_summary,
        customer_summary: formData.customer_summary,
        revenue_summary: formData.revenue_summary,
        why_interesting: formData.why_interesting,
        tags: formData.tags,
        source: formData.source,
        is_public_benchmark: false,
      };

      if (formData.valuation) {
        payload.valuation = parseInt(formData.valuation.replace(/[^0-9]/g, ''), 10);
      }

      const newDeal = await api.createDeal(payload);
      // Wait for it to be indexed and tasks generated
      await api.analyzeDeal(newDeal.id).catch(console.error);

      // set active deal id
      if (typeof window !== "undefined") {
        localStorage.setItem("activeDealId", newDeal.id.toString());
      }
      
      // route to the deal's command center
      router.push(`/deals/${newDeal.id}`);
      
    } catch (err) {
      console.error(err);
      alert("Failed to create deal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Add New Deal</h1>
            <p className="text-slate-500 mt-1">
              Create a new deal manually. This will initialize the Apex workflow, generate automated diligence tasks, and spin up a Deal Room.
            </p>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Save & Initialize Deal"}
            {!isSubmitting && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-500" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startup_name">Startup Name <span className="text-red-500">*</span></Label>
                <Input id="startup_name" name="startup_name" value={formData.startup_name} onChange={handleChange} placeholder="e.g. Acme Corp" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://acme.com" />
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Select value={formData.sector} onValueChange={(val) => handleSelectChange("sector", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="DevTools">DevTools</SelectItem>
                    <SelectItem value="Enterprise SaaS">Enterprise SaaS</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="Consumer">Consumer</SelectItem>
                    <SelectItem value="HardTech">HardTech</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={formData.stage} onValueChange={(val) => handleSelectChange("stage", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                    <SelectItem value="Series C+">Series C+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="founder_name">Founder Name(s)</Label>
                <Input id="founder_name" name="founder_name" value={formData.founder_name} onChange={handleChange} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder_email">Founder Email</Label>
                <Input id="founder_email" name="founder_email" type="email" value={formData.founder_email} onChange={handleChange} placeholder="jane@acme.com" />
              </div>
            </CardContent>
          </Card>

          {/* Deal Dynamics */}
          <Card>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Banknote className="w-5 h-5 mr-2 text-emerald-500" />
                Deal Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="round_size">Round Size ($)</Label>
                <Input id="round_size" name="round_size" value={formData.round_size} onChange={handleChange} placeholder="e.g. $5M" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valuation">Target Valuation ($)</Label>
                <Input id="valuation" name="valuation" value={formData.valuation} onChange={handleChange} placeholder="e.g. $25M Pre" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Deal Type</Label>
                <Select value={formData.deal_type} onValueChange={(val) => handleSelectChange("deal_type", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary">Primary (Lead/Follow)</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="Extension">Extension</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Claims & Traction */}
          <Card>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2 text-amber-500" />
                Claims & Initial Traction
              </CardTitle>
              <CardDescription>
                Information provided here will be stored as founder claims and will trigger diligence verification tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="why_interesting">Why is this interesting?</Label>
                <Textarea id="why_interesting" name="why_interesting" value={formData.why_interesting} onChange={handleChange} placeholder="Brief thesis on why we should look at this..." className="min-h-[100px]" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="revenue_summary">Revenue Claims</Label>
                  <Textarea id="revenue_summary" name="revenue_summary" value={formData.revenue_summary} onChange={handleChange} placeholder="e.g. $2M ARR, growing 10% MoM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_summary">Customer Claims</Label>
                  <Textarea id="customer_summary" name="customer_summary" value={formData.customer_summary} onChange={handleChange} placeholder="e.g. 50 Enterprise logos including Nike, Apple" />
                </div>
              </div>
            </CardContent>
          </Card>

        </form>

        <div className="flex justify-end pt-4 pb-12">
          <Button variant="outline" className="mr-4" onClick={() => router.back()}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Save & Initialize Deal"}
            {!isSubmitting && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
