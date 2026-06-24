import { CheckCircle2, Circle } from "lucide-react"

interface TimelineEvent {
  title: string
  description: string
  date: string
  actor: string
  isCompleted: boolean
  isCurrent?: boolean
}

interface DealTimelineProps {
  events: TimelineEvent[]
}

export function DealTimeline({ events }: DealTimelineProps) {
  return (
    <div className="space-y-6 border-l-2 border-muted ml-3 pl-6 relative">
      {events.map((event, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[35px] top-1 bg-background">
            {event.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-primary bg-background rounded-full" />
            ) : event.isCurrent ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-background">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground bg-background rounded-full" />
            )}
          </div>
          
          <div className={`space-y-1 ${!event.isCompleted && !event.isCurrent ? "opacity-50" : ""}`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-semibold ${event.isCurrent ? "text-primary" : ""}`}>{event.title}</h4>
              <span className="text-xs text-muted-foreground font-mono">{event.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-2">Actor: {event.actor}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
