"use client"

import { usePathname, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"
import { Deal } from "@/types"

export function DealSwitcher() {
  const [open, setOpen] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const pathname = usePathname()
  const router = useRouter()
  
  // Extract deal ID from pathname if we are on a deal page
  const segments = pathname.split('/').filter(Boolean)
  const isDealRoute = segments[0] === 'deal' && segments.length >= 2
  const currentDealId = isDealRoute ? Number(segments[1]) : null

  useEffect(() => {
    // Fetch all deals for the switcher
    api.getDeals().then(data => {
      setDeals(data)
    }).catch(console.error)
  }, [])

  const currentDeal = deals.find((deal) => deal.id === currentDealId)

  // If no deals exist, or we are not in a context where switching makes sense, we can just show a disabled state or hide it.
  // We'll always show it, but it might say "No active deal".

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-card"
        >
          {currentDeal ? (
            <div className="flex items-center gap-2 truncate">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="truncate">{currentDeal.startup_name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground truncate">Select a deal...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search deals..." />
          <CommandList>
            <CommandEmpty>No deals found.</CommandEmpty>
            <CommandGroup heading="Active Deals">
              {deals.map((deal) => (
                <CommandItem
                  key={deal.id}
                  value={deal.startup_name}
                  onSelect={() => {
                    setOpen(false)
                    // We try to maintain the same tab if possible
                    const currentTab = segments.length >= 3 ? segments[2] : "deal-room"
                    router.push(`/deal/${deal.id}/${currentTab}`)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentDealId === deal.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {deal.startup_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
