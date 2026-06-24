import { notFound } from "next/navigation"
import { api } from "@/lib/api"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { AgentWorkflowClientWrapper } from "@/components/agent-workflow/AgentWorkflowClientWrapper"

export const dynamic = "force-dynamic"

export default async function AgentWorkflowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const dealId = params.id.replace("deal-", "")
  
  let deal = null
  let workflow = null
  try {
    deal = await api.getDeal(params.id)
    workflow = await api.getAgentWorkflow(params.id)
  } catch (e) {
    console.error(e)
  }

  if (!deal) notFound()

  return (
    <div className="space-y-6">
      <PageHelpBanner 
        title="Agentic Research Workflow" 
        explanation="Watch as our 12 specialist AI agents systematically evaluate this startup from public data, map the market, verify evidence, and challenge the thesis."
      />
      
      <AgentWorkflowClientWrapper dealId={dealId} initialWorkflow={workflow} />
    </div>
  )
}
