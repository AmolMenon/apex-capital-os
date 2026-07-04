with open("frontend/app/sequoia-walkthrough/page.tsx", "r") as f:
    content = f.read()

walkthrough_injection = """
        <Card className="p-6">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
            Private Data Room Intelligence
          </h2>
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
            <p><strong>Talking Point:</strong> "Sarvam AI shows what Apex can do with public information. NeuralDesk shows the next layer: when a fund has private diligence materials, Apex can parse documents, extract metrics, detect contradictions, update conviction, and generate an IC packet grounded in both public and private evidence."</p>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Demo Flow:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open NeuralDesk from the pipeline.</li>
                <li>Navigate to the <strong>Data Room</strong> tab.</li>
                <li>Show the documents uploaded and the completeness score.</li>
                <li>Highlight the Extracted Metrics and the Contradiction Detector finding discrepancies between the deck and the KPI sheet.</li>
                <li>Open the <strong>Decision Engine</strong> to show how private data upgraded IC readiness.</li>
                <li>Open the <strong>IC Packet</strong> to show the final generated Private Diligence summary.</li>
              </ol>
            </div>
            <Link href="/deals/1/data-room">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Jump to NeuralDesk Data Room</Button>
            </Link>
          </div>
        </Card>
"""

if "Private Data Room Intelligence" not in content:
    # Let's insert it after step 2 or before the end.
    # We will just append it inside the space-y-8 div.
    # It might be tricky, let's just insert it before the closing div of space-y-8
    content = content.replace("</Card>\n      </div>", "</Card>\n" + walkthrough_injection + "\n      </div>")
    with open("frontend/app/sequoia-walkthrough/page.tsx", "w") as f:
        f.write(content)

with open("WALKTHROUGH.md", "a") as f:
    f.write("""

## Private Data Room Intelligence

**Talking point:**
"Sarvam AI shows what Apex can do with public information. NeuralDesk shows the next layer: when a fund has private diligence materials, Apex can parse documents, extract metrics, detect contradictions, update conviction, and generate an IC packet grounded in both public and private evidence."

**Demo flow:**
1. Open NeuralDesk
2. Open Data Room
3. Show documents uploaded
4. Show extracted metrics
5. Show contradiction detector
6. Show completeness score
7. Open Evidence Center
8. Open Decision Engine
9. Open War Room
10. Open IC Packet
""")

