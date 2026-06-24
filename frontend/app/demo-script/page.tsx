"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Play, MousePointer, MessageSquare, Briefcase, Bot, Server, CheckSquare } from "lucide-react";

export default function DemoScriptPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
      <div className="border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Play className="w-10 h-10 text-rose-600" /> Apex Capital Demo Script
        </h1>
        <p className="text-xl text-muted-foreground mt-4 font-serif italic">
          "The 6-minute pitch that proves Apex is the most advanced VC operating system in the world."
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
        <strong>Presenter Note:</strong> Do not rush. Let the UI breathe. The goal is to show how the AI connects dots across disconnected datasets, eventually synthesizing a robust IC packet and creating operational tasks.
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">1</div>
            <h2 className="text-2xl font-bold">The Inbound & Inbox</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Deal Inbox</Badge>
              </div>
              <p className="text-slate-700"><strong>Narration:</strong> "A founder just emailed us their pitch deck for BharatVector AI. In a traditional firm, an analyst spends 2 hours ripping through the deck, taking notes, and inputting it into Affinity. At Apex, the email is automatically parsed."</p>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
                <li>Show the deal in the Inbox.</li>
                <li>Click <strong>Analyze</strong> to show the instantaneous breakdown.</li>
                <li>Point out the Apex Score.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Step 2 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">2</div>
            <h2 className="text-2xl font-bold">The War Room & Evidence</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Deal &rarr; War Room</Badge>
              </div>
              <p className="text-slate-700"><strong>Narration:</strong> "We convert it to a deal. The system spins up a War Room. It runs a Red Team critique against the claims. It finds that they claim a $40M valuation cap, but the web research engine shows inference costs for Indic models might crush their margins."</p>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
                <li>Show the <strong>War Room</strong> dashboard.</li>
                <li>Click on the <strong>Evidence Center</strong> tab to show how every claim is grounded to a specific PDF page or Web URL.</li>
                <li>Emphasize that the AI isn't just hallucinating opinions, it's synthesizing hard facts.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Step 3 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">3</div>
            <h2 className="text-2xl font-bold">Partner Copilot Debate</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
               <div className="flex gap-2 mb-2">
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Deal &rarr; Copilot</Badge>
                <Badge variant="secondary"><MessageSquare className="w-3 h-3 mr-1"/> Type: "What is the biggest risk?"</Badge>
              </div>
              <p className="text-slate-700"><strong>Narration:</strong> "As a Partner, I don't want to read a 10-page memo. I just want to ask questions. I ask the Copilot what the biggest risk is. It immediately flags the unverified ARR and the $40M cap."</p>
            </CardContent>
          </Card>
        </section>

        {/* Step 4 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">4</div>
            <h2 className="text-2xl font-bold">Decision Engine & IC Packet</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
               <div className="flex gap-2 mb-2">
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Deal &rarr; Decision</Badge>
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Deal &rarr; IC Packet</Badge>
              </div>
              <p className="text-slate-700"><strong>Narration:</strong> "The Decision Engine calibrates all this. It tells us what would change our mind. It auto-generates the IC Packet. No more Saturday afternoons writing memos in Word."</p>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
                <li>Show the crisp output of the Decision Engine.</li>
                <li>Switch to the IC Packet tab to show the finalized, print-ready memo.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Step 5 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">5</div>
            <h2 className="text-2xl font-bold">Trust & Operations Loop</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
               <div className="flex gap-2 mb-2">
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Trust Center</Badge>
                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1"/> Go to Operations HQ</Badge>
              </div>
              <p className="text-slate-700"><strong>Narration:</strong> "But how do we trust this? We open the Trust Center. Every claim has an audit log. The system deterministically failed the 'Fund Math Gate' because $40M breaks our model. Finally, the Operations Autopilot translates that failure into an actionable task: 'Email founders to renegotiate to $25M'. The loop is closed."</p>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
