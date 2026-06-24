import glob

components_to_inject = "import { PublicBenchmarkBadge, BenchmarkWarning, SourceConfidenceBadge, SourceRegistryTable } from '@/components/diligence/PublicDataComponents'"

files = [
    'frontend/app/deal/[id]/deal-room/page.tsx',
    'frontend/app/deal/[id]/memo/page.tsx',
    'frontend/app/deal/[id]/ic-one-pager/page.tsx',
    'frontend/app/deal/[id]/research/page.tsx',
    'frontend/app/deal/[id]/diligence/page.tsx',
    'frontend/app/deal/[id]/fund-fit/page.tsx',
    'frontend/app/deal/[id]/decision/page.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    if "PublicBenchmarkBadge" not in content:
        # Inject imports
        content = content.replace('import { api } from "@/lib/api"', f'import {{ api }} from "@/lib/api"\n{components_to_inject}')
        
        # Inject badges near titles
        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">{deal.startup_name}</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">{deal.startup_name} <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')
        
        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">{deal.startup_name} Investment Memo</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">{deal.startup_name} Investment Memo <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')
        
        content = content.replace('<h1 className="text-3xl font-bold tracking-tight text-foreground">IC One-Pager: {deal.startup_name}</h1>', '<h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">IC One-Pager: {deal.startup_name} <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h1>')
        
        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">Market & Competitor Research</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">Market & Competitor Research <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')
        
        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">Diligence Command Center</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">Diligence Command Center <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')
        
        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">Decision Board</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">Decision Board <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')

        content = content.replace('<h2 className="text-3xl font-bold tracking-tight text-foreground">Fund Fit & Portfolio Math</h2>', '<h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">Fund Fit & Portfolio Math <PublicBenchmarkBadge isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} /></h2>')

        # Inject warning below page header
        content = content.replace('<div className="flex items-center justify-between">', '<BenchmarkWarning isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} />\n      <div className="flex items-center justify-between">')
        
        # Inject source registry and public facts in deal-room
        if "deal-room" in file:
            # We want to add SourceRegistry if public_profile_json exists
            registry_html = """
            {deal.public_profile_json && (
              <div className="mt-6">
                <SourceRegistryTable sources={JSON.parse(deal.public_profile_json).public_sources || []} />
              </div>
            )}
            """
            content = content.replace('</CardContent>\n        </Card>', f'{registry_html}\n        </CardContent>\n        </Card>')

        with open(file, 'w') as f:
            f.write(content)

