def generate_tam_sam_som(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    
    if 'ai' in sector:
        tam = "$120B (Global enterprise automation software spend)"
        sam = "$15B (Mid-market back-office AI automation)"
        som = "$500M (Targeting 5% of US mid-market in 5 years)"
        assump = ["Mid-market AI adoption accelerates 20% YoY", "ACV stabilizes at $50k", "Can reach 10,000 customers"]
    elif 'pet' in sector:
        tam = "$136B (US Pet Industry Spend)"
        sam = "$40B (Premium pet food & wellness)"
        som = "$200M (1% of premium urban market)"
        assump = ["LTV > $1000", "CAC < $100", "Retention > 60% after year 1"]
    else:
        tam = "$50B (Global vertical software)"
        sam = "$5B (Specific vertical US market)"
        som = "$100M (2% capture)"
        assump = ["ACV $25k", "Market grows at 8% CAGR", "Replacement cycle is 5 years"]

    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "assumptions": assump,
        "sensitivity_analysis": "If ACV drops by 20%, SOM shrinks to $80M, requiring higher market penetration to hit venture scale.",
        "confidence_level": "Medium"
    }
