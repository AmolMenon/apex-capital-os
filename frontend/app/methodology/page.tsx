import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Methodology() {
  return (
    <div className="flex-1 max-w-5xl mx-auto space-y-8 p-8 pt-6 pb-20">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Apex Capital Methodology</h2>
        <p className="text-muted-foreground text-lg">How we evaluate early-stage venture opportunities.</p>
        <p className="text-sm text-amber-600/80 bg-amber-500/10 p-3 rounded-md border border-amber-500/20 italic mt-4">
          Apex Capital is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs run in mock mode by default unless real providers are configured.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The 10-Point Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Our proprietary analysis engine evaluates startups across 10 critical dimensions to produce the overall Apex Score. 
            Each category is scored from 1 to 10 and weighted based on its importance to generating venture-scale returns.
          </p>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors">
                  <th className="h-10 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="h-10 px-4 font-medium text-muted-foreground">Weight</th>
                  <th className="h-10 px-4 font-medium text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                <tr className="border-b">
                  <td className="p-4 font-medium">Market Size</td>
                  <td className="p-4 font-medium text-primary">15%</td>
                  <td className="p-4 text-muted-foreground">Total Addressable Market (TAM). Needs to support a $1B+ outcome.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Market Timing</td>
                  <td className="p-4 font-medium text-primary">10%</td>
                  <td className="p-4 text-muted-foreground">Why now? Regulatory shifts, macro tailwinds, or technology inflections.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Founder Quality</td>
                  <td className="p-4 font-medium text-primary">15%</td>
                  <td className="p-4 text-muted-foreground">Grit, ambition, prior success, and ability to attract capital & talent.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Founder-Market Fit</td>
                  <td className="p-4 font-medium text-primary">10%</td>
                  <td className="p-4 text-muted-foreground">Domain expertise and earned secrets specific to the problem space.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Product Differentiation</td>
                  <td className="p-4 font-medium text-primary">10%</td>
                  <td className="p-4 text-muted-foreground">Is it a 10x better solution? Painkiller vs. vitamin assessment.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Traction Quality</td>
                  <td className="p-4 font-medium text-primary">10%</td>
                  <td className="p-4 text-muted-foreground">Velocity of growth, quality of revenue, and retention metrics.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Business Model Strength</td>
                  <td className="p-4 font-medium text-primary">10%</td>
                  <td className="p-4 text-muted-foreground">Gross margins, capital efficiency, and path to profitability.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Distribution Advantage</td>
                  <td className="p-4 font-medium text-primary">8%</td>
                  <td className="p-4 text-muted-foreground">GTM strategy, customer acquisition costs, and virality.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Moat Potential</td>
                  <td className="p-4 font-medium text-primary">7%</td>
                  <td className="p-4 text-muted-foreground">Network effects, data scale, switching costs, and defensibility.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Exit Potential</td>
                  <td className="p-4 font-medium text-primary">5%</td>
                  <td className="p-4 text-muted-foreground">IPO viability or strategic M&A targets in the sector.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommendation Logic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Our system assigns a final recommendation based on the overall Apex Score:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground font-medium">
              <li><span className="text-emerald-500">80 - 100: Invest.</span> High conviction opportunities that meet our stringent criteria for venture-scale returns.</li>
              <li><span className="text-amber-500">65 - 79: Watchlist.</span> Promising companies that require further diligence or need to hit specific milestones.</li>
              <li><span className="text-destructive">Below 65: Pass.</span> Does not currently align with our fund mandate or presents too many critical risks.</li>
            </ul>
            <p className="mt-4 pt-4 border-t">Note: The presence of critical red flags will automatically downgrade a recommendation regardless of the base score.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Power Law Potential</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Venture capital returns are driven by the power law—a few investments generate the vast majority of returns.</p>
            <p>Our Power Law Score identifies companies with the potential to return the entire fund. We specifically look for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Massive, highly fragmented global markets</li>
              <li>Winner-take-all dynamics (strong network effects)</li>
              <li>Zero marginal cost scalability (software/platforms)</li>
              <li>Category creation potential</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground/60 max-w-3xl mx-auto border-t pt-8">
        <p>
          Disclaimer: Apex Capital is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs run in mock mode by default unless real providers are configured.
        </p>
      </div>
    </div>
  )
}
