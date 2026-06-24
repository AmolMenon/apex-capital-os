"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { EmptyState } from "@/components/ui/EmptyState"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ActiveDealRedirect() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const activeId = localStorage.getItem("activeDealId")
    if (activeId) {
      router.replace(`/deals/${activeId}/${params.tab}`)
    } else {
      setLoading(false)
    }
  }, [router, params.tab])

  if (loading) {
    return <div className="p-12 flex justify-center items-center h-full"><div className="animate-pulse flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Loading Deal Context...</div></div>
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col justify-center items-center">
      <EmptyState
        title="No Active Deal Selected"
        description="Select a deal from your Pipeline or Dashboard to view this workspace."
        icon={<Database className="h-6 w-6" />}
      />
      <div className="mt-6">
        <Link href="/pipeline">
          <Button variant="default">View Pipeline</Button>
        </Link>
      </div>
    </div>
  )
}
