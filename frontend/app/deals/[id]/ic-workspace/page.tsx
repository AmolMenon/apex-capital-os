"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Users, History, FileText } from "lucide-react";

export default function ICWorkspace() {
  const { state, loading } = useGlobalDeal();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deal = state?.deal;

  useEffect(() => {
    if (deal?.id) {
      fetchComments();
    }
  }, [deal?.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/deals/${deal?.id}/comments`);
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !deal?.id) return;
    
    setIsSubmitting(true);
    
    // Optimistic UI
    const optimisticComment = {
      id: Date.now(),
      deal_id: deal.id,
      user_name: "You",
      content: newComment,
      section: "General",
      created_at: "Just now"
    };
    setComments([optimisticComment, ...comments]);
    setNewComment("");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/deals/${deal.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optimisticComment.content, section: "General" })
      });
      fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !state) return <div className="p-12 text-center animate-pulse">Loading IC Workspace...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-500" />
            Investment Committee Workspace
          </h1>
          <p className="text-muted-foreground mt-1">Collaborative review and decision making.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><History className="w-4 h-4 mr-2"/> Version History</Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700">Submit Vote</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-sm">
                <p>{state.analysis?.one_line_thesis || "Thesis pending."}</p>
                <div className="mt-4 p-4 bg-muted/30 rounded-md border border-border/50">
                  <h4 className="font-semibold mb-2">Why Now</h4>
                  <p>{state.analysis?.ic_one_pager?.why_now || "Not generated yet."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle>Partner Notes</CardTitle>
             </CardHeader>
             <CardContent>
                <textarea 
                  className="w-full h-32 p-3 bg-muted/20 border border-border rounded-md outline-none focus:border-primary transition-colors text-sm"
                  placeholder="Draft collaborative notes here. (Auto-saves)"
                  defaultValue="This looks like a strong team, but the valuation is steep for the current traction. We should model out the downside scenarios."
                />
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">{comment.created_at}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] mb-2">{comment.section}</Badge>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:border-primary"
                />
                <Button size="icon" onClick={handlePostComment} disabled={isSubmitting || !newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
