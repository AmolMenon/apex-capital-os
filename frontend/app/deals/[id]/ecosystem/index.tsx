"use client";

import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton";
import ForceGraphWrapper from "@/components/ui/ForceGraphWrapper";
import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Map, Link as LinkIcon, Crosshair, HelpCircle, Network } from "lucide-react";

export default function EcosystemPage() {
  const { state, loading } = useGlobalDeal();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading || !state) return <DealRoomSkeleton />;
  const { deal } = state;

  const graphData = {
    nodes: [
      { id: "startup", name: deal.startup_name, group: 1, val: 30, color: "#10b981" },
      { id: "founder1", name: deal.founder_name || "Founder", group: 2, val: 15, color: "#6366f1" },
      { id: "investor1", name: "Sequoia (Seed)", group: 3, val: 20, color: "#f59e0b" },
      { id: "investor2", name: "Y Combinator", group: 3, val: 15, color: "#f59e0b" },
      { id: "competitor1", name: "Incumbent Corp", group: 4, val: 25, color: "#f43f5e" },
      { id: "competitor2", name: "Agile Startup", group: 4, val: 15, color: "#f43f5e" },
      { id: "customer1", name: "Enterprise Co", group: 5, val: 20, color: "#06b6d4" },
      { id: "customer2", name: "Global Tech", group: 5, val: 15, color: "#06b6d4" },
      { id: "partner", name: "AWS Network", group: 6, val: 15, color: "#8b5cf6" },
      { id: "employer", name: "Stripe (Prev. Emp)", group: 7, val: 15, color: "#94a3b8" }
    ],
    links: [
      { source: "startup", target: "founder1", label: "Founded By" },
      { source: "startup", target: "investor1", label: "Funded By" },
      { source: "startup", target: "investor2", label: "Incubated By" },
      { source: "competitor1", target: "startup", label: "Competes With" },
      { source: "competitor2", target: "startup", label: "Competes With" },
      { source: "startup", target: "customer1", label: "Sells To" },
      { source: "startup", target: "customer2", label: "Sells To" },
      { source: "startup", target: "partner", label: "Partner" },
      { source: "founder1", target: "employer", label: "Worked At" }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-500" />
            Investment Decision Graph
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualizing {deal.startup_name}'s surrounding ecosystem, competitors, and gravitational pull.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Startup</Badge>
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Founders</Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Investors</Badge>
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">Competitors</Badge>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">Customers</Badge>
        </div>
      </div>

      <Card className="shadow-sm border-border/50 overflow-hidden relative">
        <div 
          ref={containerRef}
          className="w-full h-[650px] bg-background/50 cursor-crosshair"
          style={{ backgroundImage: 'radial-gradient(circle at center, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        >
          {dimensions.width > 0 && (
            <ForceGraphWrapper
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              nodeLabel="name"
              nodeColor="color"
              nodeRelSize={6}
              linkColor={() => "var(--border)"}
              linkOpacity={0.8}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              onNodeDragEnd={(node: any) => {
                node.fx = node.x;
                node.fy = node.y;
              }}
              backgroundColor="transparent"
            />
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-end">
          <div className="bg-card/80 backdrop-blur border shadow-sm p-3 rounded-lg pointer-events-auto text-xs space-y-1">
            <span className="font-semibold block mb-1">Graph Controls</span>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Scroll</span> to zoom</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Drag Background</span> to pan</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Drag Node</span> to pin</p>
          </div>
          <div className="bg-card/80 backdrop-blur border shadow-sm p-3 rounded-lg pointer-events-auto text-xs max-w-xs text-right">
            <p className="text-muted-foreground">This ecosystem graph helps visualize systemic risk, portfolio overlaps, and potential GTM synergies.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
