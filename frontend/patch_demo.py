with open("frontend/app/demo-control-center/page.tsx", "r") as f:
    content = f.read()

portfolio_demo = """
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg dark:bg-emerald-900/30">
              <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Portfolio Intelligence Demo</h2>
              <p className="text-sm text-neutral-500">Showcase post-investment monitoring and value creation.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm">Use <strong>Portfolio HQ</strong> to show the aggregated health of active companies, followed by drilling into <strong>NeuralDesk</strong>'s company profile to demonstrate how founder updates, KPI timeseries, and board decks are automatically parsed.</p>
            <p className="text-sm">Use <strong>Reserves</strong> to show dynamic capital allocation recommendations based on tracking follow-on conviction metrics over time.</p>
            
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/portfolio">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Open Portfolio HQ</Button>
              </Link>
              <Link href="/portfolio/reserves">
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">Open Reserve Allocations</Button>
              </Link>
            </div>
          </div>
        </Card>
"""

import re

# Add import
content = re.sub(r'import { Play, Database, BookOpen, Presentation, Users, Search, Target, PieChart as LucidePieChart } from "lucide-react";', 
                 'import { Play, Database, BookOpen, Presentation, Users, Search, Target, PieChart } from "lucide-react";', 
                 content)

# Insert the new card before the last closing </div></div>
content = content.replace("      </div>\n    </div>", portfolio_demo + "\n      </div>\n    </div>")

with open("frontend/app/demo-control-center/page.tsx", "w") as f:
    f.write(content)
