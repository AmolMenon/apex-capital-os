"use client"
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlaybookBuilder() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Playbook Builder</h1>
      <p className="text-muted-foreground">Read/Edit Light UI (Mock Save for Demo)</p>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Investment Philosophy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-bold">Founder-Market Fit Importance</label><select className="w-full p-2 border rounded"><option>High</option><option>Medium</option></select></div>
            <div><label className="text-sm font-bold">Valuation Sensitivity</label><select className="w-full p-2 border rounded"><option>High</option><option>Low</option></select></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Decision Gates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-bold">Min Evidence Score for IC</label><input type="number" defaultValue={60} className="w-full p-2 border rounded"/></div>
            <div className="text-xs text-rose-500 mt-4">* Note: Universal safety gates (like no direct invest from public data alone) remain locked and cannot be disabled.</div>
          </CardContent>
        </Card>
      </div>
      <Button className="mt-4">Save Custom Playbook (Mock)</Button>
    </div>
  )
}
