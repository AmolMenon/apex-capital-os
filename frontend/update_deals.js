const fs = require('fs');

const fileContent = fs.readFileSync('data/extended_deals.ts', 'utf8');

// Extract the array using regex or eval
const match = fileContent.match(/export const extendedDeals \= \n(\[[\s\S]*\]);/);
if (match) {
    let deals = eval(match[1]);
    
    deals = deals.map(deal => {
        let rec = "";
        let conf = "";
        
        if (deal.metrics.arr > 10000000) {
            rec = `I have been tracking ${deal.startup_name} since their Seed. The momentum here is undeniable. Revenue growth is at ${deal.metrics.yoy_growth}% YoY, which is top-quartile for ${deal.sector}. However, I am increasingly concerned about their burn rate of $${(deal.metrics.burn_rate/1000).toFixed(0)}k/mo. If they can justify the GTM efficiency, I strongly recommend proceeding.`;
            conf = "High";
        } else if (deal.metrics.nrr > 120) {
            rec = `The net dollar retention of ${deal.metrics.nrr}% indicates immense product stickiness. I spoke with 3 former customers of their main competitor, ${deal.competitors[0] || 'incumbents'}, and they all cited ${deal.startup_name}'s superior UX. This is a definitive signal. Recommend moving to deep diligence.`;
            conf = "Medium-High";
        } else {
            rec = `I am hesitant. While the TAM is large, the CAC payback of ${deal.metrics.cac_payback_months} months is stretching thin in this macro environment. This assumption weakened after reviewing the latest cohort data. Unless we see a clear path to ${deal.competitors[0] ? 'beating ' + deal.competitors[0] : 'dominance'}, we should pass.`;
            conf = "Low";
        }
        
        if (deal.analysis) {
            deal.analysis.opinionated_recommendation = rec;
            deal.analysis.confidence = conf;
        }
        
        return deal;
    });

    const newContent = `export const extendedDeals = \n${JSON.stringify(deals, null, 2)};\n`;
    fs.writeFileSync('data/extended_deals.ts', newContent);
    console.log('Successfully updated extended_deals.ts');
} else {
    console.error('Could not parse deals array');
}
