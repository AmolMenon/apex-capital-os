"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { api } from "@/lib/api"

export default function NewDeal() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const loadSampleStartup = (type: string) => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return;
    
    const setVal = (name: string, val: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (el) el.value = val;
    }

    if (type === "NeuralDesk") {
      setVal('startup_name', 'NeuralDesk');
      setVal('sector', 'Enterprise SaaS');
      setVal('stage', 'Series A');
      setVal('geography', 'San Francisco');
      setVal('business_model', 'B2B SaaS / Usage-Based');
      setVal('description', 'NeuralDesk is an AI-powered customer support automation platform for enterprise contact centers. It uses custom LLM fine-tuning to resolve 40% of tier 1 tickets automatically.');
      setVal('founder_background', 'Second-time founders. CEO was previously VP Product at Zendesk. CTO has a PhD in NLP from Stanford.');
      setVal('market_size', '8000');
      setVal('growth_rate', '25');
      setVal('revenue', '2.5');
      setVal('arr', '3');
      setVal('gross_margin', '75');
      setVal('cac', '15000');
      setVal('ltv', '120000');
      setVal('funding_raised', '4.5');
      setVal('valuation', '30');
      setVal('competitors', 'Intercom, Zendesk, Ada, Forethought');
    } else if (type === "VetPulse") {
      setVal('startup_name', 'VetPulse AI');
      setVal('sector', 'Vertical SaaS');
      setVal('stage', 'Seed');
      setVal('geography', 'Austin');
      setVal('business_model', 'B2B SaaS');
      setVal('description', 'Workflow automation and triage tool for veterinary clinics.');
      setVal('founder_background', 'Former veterinarians and clinic owners.');
      setVal('market_size', '4500');
      setVal('growth_rate', '12');
      setVal('revenue', '0.5');
      setVal('arr', '0.8');
      setVal('gross_margin', '82');
      setVal('cac', '3000');
      setVal('ltv', '25000');
      setVal('funding_raised', '1.2');
      setVal('valuation', '10');
      setVal('competitors', 'Idexx, Covetrus');
    } else if (type === "Fintech") {
      setVal('startup_name', 'PayStream');
      setVal('sector', 'Fintech');
      setVal('stage', 'Series B');
      setVal('geography', 'New York');
      setVal('business_model', 'Transaction Fee');
      setVal('description', 'B2B cross-border payment infrastructure for mid-market manufacturing.');
      setVal('founder_background', 'Ex-Stripe and ex-Plaid engineering leads.');
      setVal('market_size', '20000');
      setVal('growth_rate', '40');
      setVal('revenue', '12');
      setVal('arr', '15');
      setVal('gross_margin', '60');
      setVal('cac', '40000');
      setVal('ltv', '300000');
      setVal('funding_raised', '18');
      setVal('valuation', '120');
      setVal('competitors', 'Airwallex, Rapyd, Flywire');
    } else if (type === "Climate") {
      setVal('startup_name', 'CarbonLoop');
      setVal('sector', 'Climate Tech');
      setVal('stage', 'Seed');
      setVal('geography', 'London');
      setVal('business_model', 'Hardware + SaaS');
      setVal('description', 'Industrial carbon capture IoT devices with software dashboard.');
      setVal('founder_background', 'Oxford PhDs in Chemical Engineering.');
      setVal('market_size', '15000');
      setVal('growth_rate', '60');
      setVal('revenue', '0.2');
      setVal('arr', '0.3');
      setVal('gross_margin', '45');
      setVal('cac', '8000');
      setVal('ltv', '40000');
      setVal('funding_raised', '2.5');
      setVal('valuation', '15');
      setVal('competitors', 'Climeworks, CarbonCapture');
    } else if (type === "Clear") {
      form.reset();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      startup_name: formData.get("startup_name"),
      sector: formData.get("sector"),
      stage: formData.get("stage"),
      geography: formData.get("geography"),
      business_model: formData.get("business_model"),
      description: formData.get("description"),
      founder_background: formData.get("founder_background"),
      market_size: Number(formData.get("market_size")) || null,
      growth_rate: Number(formData.get("growth_rate")) || null,
      revenue: Number(formData.get("revenue")) || null,
      mrr: Number(formData.get("mrr")) || null,
      arr: Number(formData.get("arr")) || null,
      users: Number(formData.get("users")) || null,
      customers: Number(formData.get("customers")) || null,
      retention_rate: Number(formData.get("retention_rate")) || null,
      gross_margin: Number(formData.get("gross_margin")) || null,
      cac: Number(formData.get("cac")) || null,
      ltv: Number(formData.get("ltv")) || null,
      funding_raised: Number(formData.get("funding_raised")) || null,
      valuation: Number(formData.get("valuation")) || null,
      competitors: formData.get("competitors"),
    }

    try {
      const deal = await api.createDeal(data)
      
      // Trigger analysis
      await fetch(`http://127.0.0.1:8000/analyze/${deal.id}`, {
        method: 'POST'
      })
      
      router.push(`/deals/${deal.id}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">New Deal Intake</h2>
      </div>

      <PageHelpBanner 
        title="New Deal Intake" 
        explanation="Start here when evaluating a new startup. Add enough information for the first analysis. You can refine the deal later."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Core startup details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Startup Name *</label>
                    <input required name="startup_name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sector *</label>
                      <input required name="sector" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stage *</label>
                      <select required name="stage" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="Idea">Idea</option>
                        <option value="Pre-seed">Pre-seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Series B">Series B</option>
                        <option value="Growth">Growth</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Geography *</label>
                      <input required name="geography" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Model *</label>
                      <input required name="business_model" placeholder="e.g. B2B SaaS" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea required name="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Founder & Market</CardTitle>
                  <CardDescription>It is okay if this is unknown. The system will mark it as a research gap.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Founder Background</label>
                    <textarea name="founder_background" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Market Size (M)</label>
                      <input type="number" name="market_size" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Growth Rate (%)</label>
                      <input type="number" name="growth_rate" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traction & Metrics</CardTitle>
                  <CardDescription>Leave fields blank if data is unavailable in the pitch deck.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Revenue</label>
                      <input type="number" name="revenue" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">MRR</label>
                      <input type="number" name="mrr" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ARR</label>
                      <input type="number" name="arr" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Customers</label>
                      <input type="number" name="customers" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gross Margin (%)</label>
                      <input type="number" name="gross_margin" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CAC</label>
                      <input type="number" name="cac" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">LTV</label>
                      <input type="number" name="ltv" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fundraising & Competition</CardTitle>
                  <CardDescription>Deal terms and competitive landscape</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Funding Raised (M)</label>
                      <input type="number" step="0.1" name="funding_raised" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valuation (M)</label>
                      <input type="number" name="valuation" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Competitors</label>
                    <textarea name="competitors" placeholder="List key competitors" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  </div>
                </CardContent>
              </Card>
              
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading} size="lg" className="px-8 shadow-md font-semibold">
                {loading ? "Analyzing Deal..." : "Submit & Evaluate Analysis"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side Panel - Sample Data */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 bg-muted/20 border-primary/20">
            <CardHeader className="pb-4 border-b border-primary/10">
              <CardTitle className="text-lg">Need sample data?</CardTitle>
              <CardDescription>Load pre-configured startup profiles to test the platform.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Button variant="outline" className="w-full justify-start font-medium text-left bg-background hover:bg-muted" onClick={() => loadSampleStartup('NeuralDesk')}>
                <div className="truncate">1. Use NeuralDesk sample</div>
              </Button>
              <Button variant="outline" className="w-full justify-start font-medium text-left bg-background hover:bg-muted" onClick={() => loadSampleStartup('VetPulse')}>
                <div className="truncate">2. Use VetPulse AI sample</div>
              </Button>
              <Button variant="outline" className="w-full justify-start font-medium text-left bg-background hover:bg-muted" onClick={() => loadSampleStartup('Fintech')}>
                <div className="truncate">3. Use Fintech sample</div>
              </Button>
              <Button variant="outline" className="w-full justify-start font-medium text-left bg-background hover:bg-muted" onClick={() => loadSampleStartup('Climate')}>
                <div className="truncate">4. Use Climate sample</div>
              </Button>
              <div className="pt-2">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={() => loadSampleStartup('Clear')}>
                  Clear form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
