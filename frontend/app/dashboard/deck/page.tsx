"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Target, ShieldAlert, TrendingUp, CheckCircle2, History, ArrowRight } from "lucide-react";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { EvidenceHeatmap } from "@/components/deck/EvidenceHeatmap";

export default function PitchDeckPage() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [slides, setSlides] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any>(null);
  const { deal } = useGlobalDeal();

  useEffect(() => {
    if (deal) {
      DealsService.getSlideReview(deal.id).then(data => {
        if (data.slides) {
          setSlides(data.slides.map((s: any) => ({
            id: s.slide_number,
            title: s.title || `Slide ${s.slide_number}`,
            status: s.status === "VERIFIED" ? "success" : s.status === "CONTRADICTION" ? "destructive" : "warning",
            feedback: s.feedback,
            linked_findings: s.linked_findings || []
          })));
          
          if (data.slides.length > 0) {
            setActiveSlide(data.slides[0].slide_number);
          }
        }
      });

      DealsService.getCompare(deal.id, 1, 2).then(data => {
        setCompareData(data);
      });
    }
  }, [deal]);

  const currentSlide = slides.find(s => s.id === activeSlide);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deck Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Review extracted claims and detected conflicts.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-muted-foreground">
            Current: v4_final_final.pdf
          </div>
          <Button variant="secondary" size="sm" className="h-8">
            <UploadCloud className="w-3.5 h-3.5 mr-2" /> Upload New Version
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <div className="border-b border-border/50 mb-6">
          <TabsList className="bg-transparent h-10 p-0 border-b-0 space-x-6">
            <TabsTrigger 
              value="current" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 pt-2 shadow-none font-medium text-muted-foreground data-[state=active]:text-foreground"
            >
              Current Version
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 pt-2 shadow-none font-medium text-muted-foreground data-[state=active]:text-foreground"
            >
              Progress Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="mt-0 outline-none">
          <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
            {/* Left Col: Slide Navigator */}
            <div className="col-span-1 border border-border/50 rounded-lg bg-background flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 font-medium text-sm text-muted-foreground bg-background">
                Slides
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {slides.length === 0 ? (
                  <div className="p-4 text-xs text-muted-foreground text-center">No slides found.</div>
                ) : (
                  slides.map(slide => (
                    <button 
                      key={slide.id}
                      onClick={() => setActiveSlide(slide.id)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                        activeSlide === slide.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <span className="truncate pr-4">{slide.id}. {slide.title}</span>
                      <div className="shrink-0">
                        {slide.status === "success" && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
                        {slide.status === "warning" && <div className="w-1.5 h-1.5 rounded-full bg-warning" />}
                        {slide.status === "destructive" && <div className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Col: Slide Viewer & Analysis */}
            <div className="col-span-3 space-y-6 flex flex-col h-full">
              
              {/* Evidence Heatmap Viewer */}
              <div className="flex-1 min-h-0 flex flex-col">
                <EvidenceHeatmap slideId={activeSlide} slideTitle={currentSlide?.title} />
              </div>

              {/* Extraction Feedback Panel */}
              <div className="shrink-0 border border-border/50 rounded-lg bg-background p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Investment Committee Review</h3>
                
                {currentSlide?.status === "success" && (
                  <p className="text-sm text-success leading-relaxed">{currentSlide.feedback}</p>
                )}
                {currentSlide?.status === "warning" && (
                  <div className="flex gap-3 items-start">
                    <Target className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Unverified Claim</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{currentSlide.feedback}</p>
                    </div>
                  </div>
                )}
                {currentSlide?.status === "destructive" && (
                  <div className="flex gap-3 items-start">
                    <ShieldAlert className="w-4 h-4 text-destructive mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Critical Conflict</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{currentSlide.feedback}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-0 outline-none">
          {compareData ? (
            <div className="space-y-8 max-w-4xl">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-border/50 rounded-lg p-6 bg-background">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Readiness Delta</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-semibold text-muted-foreground line-through">{compareData.confidence_v1}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-3xl font-bold text-foreground">{compareData.confidence_v2}</span>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-6 bg-background">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Conflicts Resolved</div>
                  <div className="text-3xl font-bold text-foreground">{compareData.resolved_conflicts_count}</div>
                </div>

                <div className="border border-border/50 rounded-lg p-6 bg-background">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Assumptions Validated</div>
                  <div className="text-3xl font-bold text-foreground">{compareData.assumptions_validated_count}</div>
                </div>
              </div>

              <div className="border border-border/50 rounded-lg bg-background overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-background/50">
                  <h3 className="text-sm font-semibold text-foreground">Perception Delta (V1 vs Current)</h3>
                </div>
                <div className="p-6 space-y-8">
                  {compareData.perception_delta?.strengthened_claims?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-success" /> Strengthened Claims
                      </h4>
                      <div className="space-y-2">
                        {compareData.perception_delta.strengthened_claims.map((c: any, i: number) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/50 rounded bg-background gap-3">
                            <span className="text-sm text-foreground">{c.statement}</span>
                            <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded whitespace-nowrap">{c.delta}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {compareData.perception_delta?.resolved_conflicts?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground" /> Resolved Conflicts
                      </h4>
                      <div className="space-y-2">
                        {compareData.perception_delta.resolved_conflicts.map((c: any, i: number) => (
                          <div key={i} className="p-3 border border-border/50 rounded bg-background">
                            <span className="text-sm text-foreground">{c.rationale}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading progress timeline...</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
