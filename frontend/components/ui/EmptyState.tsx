"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  icon?: React.ElementType;
}

export function EmptyState({ title, description, primaryActionLabel, onPrimaryAction, icon: Icon = Bot }: EmptyStateProps) {
  return (
    <Card className="bg-muted/10 border-dashed border-border/50 text-center shadow-none hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="pt-4">
          <Button onClick={onPrimaryAction} className="gap-2 group">
            {primaryActionLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
