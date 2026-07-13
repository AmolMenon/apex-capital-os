"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and workspace preferences.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your personal profile and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">founder@acmecorp.com</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">Permanently delete all data and analysis.</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
