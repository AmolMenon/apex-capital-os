"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Users, History, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CollaborationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, author: "Sarah (Principal)", avatar: "S", role: "Principal", text: "Are we sure about the CAC payback period? The math seems to rely on an aggressive churn assumption given the macro environment.", time: "2 hours ago", type: "comment" },
    { id: 2, author: "Platform Intelligence", avatar: "A", role: "System", text: "Re-calculated CAC payback using historical churn (12%). Payback increases from 6mo to 7.5mo.", time: "1 hour ago", type: "system" },
    { id: 3, author: "Alex (GP)", avatar: "A", role: "Partner", text: "Assigning DD task: Verify Q3 enterprise contracts and cross-reference with Stripe billing.", time: "45 mins ago", type: "task", completed: false },
    { id: 4, author: "System", avatar: "S", role: "System", text: "Competitor 'DataMesh' just raised $50M Series B from Sequoia.", time: "30 mins ago", type: "system" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        author: "You",
        avatar: "Y",
        role: "Analyst",
        text: input,
        time: "Just now",
        type: "comment"
      }
    ]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
          <MessageSquare className="w-4 h-4 mr-2" />
          Collaboration
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 border-l border-border/50">
        <SheetHeader className="p-6 border-b bg-muted/20">
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Deal War Room
          </SheetTitle>
          <div className="flex gap-4 mt-4">
            <button className="text-sm font-bold border-b-2 border-primary text-primary pb-2">Comments & Tasks</button>
            <button className="text-sm font-medium border-b-2 border-transparent text-muted-foreground pb-2">Version History</button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                ${msg.type === 'system' ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground'}`}>
                {msg.avatar}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-foreground">{msg.author}</span>
                    <span className="text-xs text-muted-foreground ml-2">{msg.role}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                
                {msg.type === 'task' ? (
                  <div 
                    onClick={() => toggleTask(msg.id)}
                    className={`mt-2 p-3 rounded-md border flex gap-3 cursor-pointer transition-colors
                      ${msg.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-muted/50 border-border'}`}
                  >
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${msg.completed ? 'text-emerald-500' : 'text-muted-foreground/50'}`} />
                    <span className={`text-sm ${msg.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div className={`text-sm p-3 rounded-md ${msg.type === 'system' ? 'bg-primary/5 border border-primary/20 text-primary/90' : 'bg-muted/30 text-foreground/90'}`}>
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-background">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Type a comment or /task to assign..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-muted/50 focus-visible:ring-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
