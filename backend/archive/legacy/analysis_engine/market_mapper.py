def map_market(deal: dict) -> dict:
    market_size = deal.get("market_size", 0) or 0
    
    # Simple heuristic logic
    tam = f"${market_size}M Global TAM"
    sam = f"${market_size * 0.4:,.0f}M Serviceable Addressable Market"
    som = f"${market_size * 0.05:,.0f}M Serviceable Obtainable Market"
    
    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "growth_drivers": [
            "Digital transformation",
            "Shift to cloud native architectures",
            "Automation of legacy workflows"
        ]
    }
