"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    api.getApprovals().then(setApprovals);
  }, []);

  const approve = async (id: string) => {
    await api.approveRequest(id);
    api.getApprovals().then(setApprovals);
  };

  const reject = async (id: string) => {
    await api.rejectRequest(id);
    api.getApprovals().then(setApprovals);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Pending Approvals</h1>
      <div className="grid gap-4">
        {approvals.map(a => (
          <Card key={a.approval_id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{a.action}</h3>
                <p className="text-sm text-muted-foreground">Requester: {a.requester} | Status: {a.status}</p>
                <p className="text-sm mt-2">{a.reason}</p>
              </div>
              {a.status === 'pending' && (
                <div className="space-x-2 flex">
                  <Button onClick={() => approve(a.approval_id)}>Approve</Button>
                  <Button variant="destructive" onClick={() => reject(a.approval_id)}>Reject</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
