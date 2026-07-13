"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Target, AlertTriangle, ShieldAlert } from "lucide-react";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";

export default function PitchDeckPage() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [slides, setSlides] = useState<any[]>([]);
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
    }
  }, [deal]);

  const currentSlide = slides.find(s => s.id === activeSlide);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pitch Deck Analysis</h1>
          <p className="text-muted-foreground mt-1">Review AI feedback on your narrative flow.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-sm border border-border px-4 py-2 rounded-md bg-card flex items-center">
            <span className="text-muted-foreground mr-2">Current:</span> 
            <span className="font-semibold">v4_final_final.pdf</span>
          </div>
          <Button variant="secondary">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload New Version
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Left Col: Slide Navigator */}
        <div className="col-span-1 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border font-semibold bg-muted/20">
            Slide Navigator
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {slides.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No slides analyzed.</div>
            ) : (
              slides.map(slide => (
                <button 
                  key={slide.id}
                  onClick={() => setActiveSlide(slide.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center justify-between transition-colors ${
                    activeSlide === slide.id ? "bg-primary/10 text-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span>{slide.id}. {slide.title}</span>
                  {slide.status === "success" && <div className="w-2 h-2 rounded-full bg-success" />}
                  {slide.status === "warning" && <div className="w-2 h-2 rounded-full bg-warning" />}
                  {slide.status === "destructive" && <div className="w-2 h-2 rounded-full bg-destructive" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Slide Viewer & Analysis */}
        <div className="col-span-2 space-y-6 flex flex-col">
          
          {/* Mock PDF Viewer */}
          <div className="flex-1 border border-border rounded-xl bg-muted/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
              <FileText className="w-16 h-16 mb-4" />
              <p className="font-medium text-lg">Slide {activeSlide}</p>
              <p className="text-sm">{currentSlide?.title}</p>
            </div>
          </div>

          {/* AI Feedback Panel */}
          <Card className="bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Slide Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {currentSlide?.status === "success" && (
                <p className="text-success font-medium">{currentSlide.feedback}</p>
              )}
              {currentSlide?.status === "warning" && (
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Investor Concern</h4>
                    <p className="text-muted-foreground text-sm">{currentSlide.feedback}</p>
                  </div>
                </div>
              )}
              {currentSlide?.status === "destructive" && (
                <div className="flex gap-3 items-start">
                  <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Critical Conflict</h4>
                    <p className="text-muted-foreground text-sm">{currentSlide.feedback}</p>
                    <Button variant="outline" size="sm" className="mt-3">Create Task in Action Center</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
