import json
import re

with open('data/extended_deals.ts', 'r') as f:
    content = f.read()

match = re.search(r'export const extendedDeals = \n(\[.*\]);', content, re.DOTALL)
if match:
    json_str = match.group(1)
    try:
        deals = json.loads(json_str)
        
        for deal in deals:
            metrics = deal.get('metrics', {})
            arr = metrics.get('arr', 0)
            nrr = metrics.get('nrr', 0)
            yoy_growth = metrics.get('yoy_growth', 0)
            burn_rate = metrics.get('burn_rate', 0)
            cac = metrics.get('cac_payback_months', 0)
            competitors = deal.get('competitors', [])
            comp = competitors[0] if competitors else 'incumbents'
            name = deal.get('startup_name', 'This company')
            sector = deal.get('sector', 'their sector')
            
            if arr > 10000000:
                rec = f"Historical analysis indicates strong momentum. Revenue growth of {yoy_growth}% YoY places {name} in the top-quartile for {sector}. However, current financial models highlight a concerning burn rate of ${int(burn_rate/1000)}k/mo. If GTM efficiency can be verified, evidence supports proceeding."
                conf = "High"
            elif nrr > 120:
                rec = f"Net dollar retention of {nrr}% provides strong evidence of product stickiness. Customer reference transcripts consistently cite superior UX compared to {comp}. The available data supports moving to deep diligence."
                conf = "Moderate"
            else:
                rec = f"The available information is currently insufficient to justify an investment. While TAM models show promise, cohort data reveals a CAC payback of {cac} months, weakening initial assumptions. Unless a definitive path to outcompeting {comp} can be proven, the recommendation is to pass."
                conf = "Low"
                
            analysis = deal.get('analysis', {})
            analysis['opinionated_recommendation'] = rec
            analysis['confidence'] = conf
            deal['analysis'] = analysis

        new_json = json.dumps(deals, indent=2)
        new_content = f"export const extendedDeals = \n{new_json};\n"
        
        with open('data/extended_deals.ts', 'w') as f:
            f.write(new_content)
            
        print("Success")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
else:
    print("No match")
