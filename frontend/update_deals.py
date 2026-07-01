import json
import re

with open('data/extended_deals.ts', 'r') as f:
    content = f.read()

# Extract JSON
match = re.search(r'export const extendedDeals = \n(\[.*\]);', content, re.DOTALL)
if match:
    json_str = match.group(1)
    # The JSON in the TS file is actually valid JSON because it was stringified
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
                rec = f"I have been tracking {name} since their Seed. The momentum here is undeniable. Revenue growth is at {yoy_growth}% YoY, which is top-quartile for {sector}. However, I am increasingly concerned about their burn rate of ${int(burn_rate/1000)}k/mo. If they can justify the GTM efficiency, I strongly recommend proceeding."
                conf = "High"
            elif nrr > 120:
                rec = f"The net dollar retention of {nrr}% indicates immense product stickiness. I spoke with 3 former customers of their main competitor, {comp}, and they all cited {name}'s superior UX. This is a definitive signal. Recommend moving to deep diligence."
                conf = "Medium-High"
            else:
                rec = f"I am hesitant. While the TAM is large, the CAC payback of {cac} months is stretching thin in this macro environment. This assumption weakened after reviewing the latest cohort data. Unless we see a clear path to beating {comp}, we should pass."
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
