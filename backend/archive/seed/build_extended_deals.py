import json
import random
from datetime import datetime, timedelta

SECTORS = ["AI", "Fintech", "Climate", "Healthcare", "Enterprise", "Cybersecurity", "Consumer", "Developer Tools", "Manufacturing", "DeepTech"]

COMPANIES = [
    ("NexusAI", "AI", "Enterprise LLM Orchestration", "B2B SaaS", "San Francisco, CA"),
    ("Aura Health", "Healthcare", "Digital Biomarkers for Cognitive Decline", "B2B2C", "Boston, MA"),
    ("CarbonGrid", "Climate", "Decentralized Carbon Accounting Network", "Enterprise API", "Berlin, Germany"),
    ("PayFlow", "Fintech", "Cross-border B2B Payments Infrastructure", "Fintech API", "London, UK"),
    ("ShieldDev", "Cybersecurity", "Shift-left Container Security", "DevSecOps", "Tel Aviv, Israel"),
    ("OmniStack", "Developer Tools", "Unified Cloud Deployment Fabric", "PaaS", "Seattle, WA"),
    ("ForgeTech", "Manufacturing", "AI-driven Additive Manufacturing CNC", "Hardware/SaaS", "Detroit, MI"),
    ("QuantumCore", "DeepTech", "Room-temperature Quantum Sensors", "Hardware", "Cambridge, UK"),
    ("Lumiere", "Consumer", "Creator Economy Monetization Platform", "Marketplace", "Los Angeles, CA"),
    ("Vaulta", "Enterprise", "Zero-trust Corporate Identity", "SaaS", "Austin, TX"),
    ("TuringData", "AI", "Synthetic Data Generation for Autonomy", "API", "San Francisco, CA"),
    ("MedSync", "Healthcare", "Interoperable EMR Data Layer", "Healthcare IT", "Chicago, IL"),
    ("TerraVolt", "Climate", "Solid-state Battery Management Systems", "Hardware/Software", "Stockholm, Sweden"),
    ("LendEdge", "Fintech", "Embedded Lending for Marketplaces", "API", "New York, NY"),
    ("ZeroDay", "Cybersecurity", "Automated Pen-testing via LLMs", "SaaS", "Washington, DC"),
    ("BuildKite", "Developer Tools", "Next-gen CI/CD Orchestration", "SaaS", "Sydney, Australia"),
    ("MacroFab", "Manufacturing", "PCBA Prototyping Marketplace", "Marketplace", "Houston, TX"),
    ("NeuralLink", "DeepTech", "Non-invasive BCI Interfaces", "Hardware", "San Diego, CA"),
    ("TrendSet", "Consumer", "Social Commerce for Gen Z", "Social/Commerce", "Seoul, South Korea"),
    ("WorkSphere", "Enterprise", "Asynchronous HR & Payroll", "SaaS", "Toronto, Canada"),
    ("Cogito", "AI", "Edge AI for Retail Analytics", "IoT/SaaS", "London, UK"),
    ("GenoWrite", "Healthcare", "CRISPR Off-target Prediction Engine", "Software", "Boston, MA"),
    ("SunPath", "Climate", "Agrivoltaics Yield Optimization", "SaaS", "Denver, CO"),
    ("StarkBank", "Fintech", "Corporate Banking API", "Fintech", "São Paulo, Brazil"),
    ("Phalanx", "Cybersecurity", "Post-quantum Cryptography Modules", "Enterprise Software", "Zurich, Switzerland"),
    ("TypeSafe", "Developer Tools", "Static Analysis for Smart Contracts", "SaaS", "Singapore"),
    ("RoboFlex", "Manufacturing", "Cobot Fleet Management", "SaaS", "Munich, Germany"),
    ("AeroSpace", "DeepTech", "Reusable Small-lift Launch Vehicles", "Hardware", "Los Angeles, CA"),
    ("VibeCheck", "Consumer", "Audio-first Dating App", "Consumer Mobile", "New York, NY"),
    ("DataMesh", "Enterprise", "Real-time Data Streaming Mesh", "Infrastructure", "San Francisco, CA")
]

FOUNDERS = ["Alex Chen", "Sarah Jenkins", "Michael Chang", "Elena Rostova", "David Kumar", "Emily Wei", "James O'Connor", "Priya Patel", "Marcus Johnson", "Nina Singh"]
UNIVERSITIES = ["Stanford", "MIT", "Harvard", "UC Berkeley", "Oxford", "Cambridge", "ETH Zurich", "Waterloo"]
PREVIOUS_COMPANIES = ["Stripe", "Airbnb", "Google", "Meta", "Palantir", "Databricks", "SpaceX", "Tesla"]
INVESTORS = ["Sequoia", "a16z", "Benchmark", "Founders Fund", "Lightspeed", "Accel", "Index Ventures", "Bessemer"]

deals = []
id_counter = 1000

for i, (name, sector, tagline, model, hq) in enumerate(COMPANIES):
    f1 = random.choice(FOUNDERS)
    f2 = random.choice(FOUNDERS)
    uni = random.choice(UNIVERSITIES)
    prev = random.choice(PREVIOUS_COMPANIES)
    
    stage = random.choice(["Seed", "Series A", "Series B", "Series C"])
    
    if stage == "Seed":
        arr = random.randint(100, 500) * 1000
        val = random.randint(10, 25) * 1000000
        employees = random.randint(5, 15)
        burn = random.randint(50, 100) * 1000
    elif stage == "Series A":
        arr = random.randint(1, 5) * 1000000
        val = random.randint(30, 80) * 1000000
        employees = random.randint(20, 50)
        burn = random.randint(200, 500) * 1000
    elif stage == "Series B":
        arr = random.randint(6, 15) * 1000000
        val = random.randint(100, 300) * 1000000
        employees = random.randint(60, 150)
        burn = random.randint(600, 1200) * 1000
    else:
        arr = random.randint(20, 50) * 1000000
        val = random.randint(400, 1000) * 1000000
        employees = random.randint(200, 500)
        burn = random.randint(1500, 3000) * 1000
        
    cash = burn * random.randint(12, 24)
    runway = round(cash / burn)
    
    # Generate timelines
    timeline = []
    base_date = datetime.now() - timedelta(days=700)
    
    timeline.append({"date": base_date.strftime("%Y-%m-%d"), "event": f"Company incorporated in {hq}"})
    timeline.append({"date": (base_date + timedelta(days=90)).strftime("%Y-%m-%d"), "event": f"Raised Pre-seed from angel syndicate"})
    timeline.append({"date": (base_date + timedelta(days=365)).strftime("%Y-%m-%d"), "event": f"Launched V1 of {name} platform"})
    timeline.append({"date": (base_date + timedelta(days=500)).strftime("%Y-%m-%d"), "event": f"Hit $1M ARR milestone"})
    
    # Generate relationships
    related_company = random.choice([c[0] for c in COMPANIES if c[0] != name])
    
    founder_bios = [
        {"name": f1, "role": "CEO", "bio": f"Former Product Lead at {prev}. Graduated from {uni}. Led a team of 50 engineers."},
        {"name": f2, "role": "CTO", "bio": f"Ex-Principal Engineer at {random.choice(PREVIOUS_COMPANIES)}. Early employee at {related_company}. PhD in Computer Science."}
    ]
    
    deals.append({
        "id": id_counter,
        "startup_name": name,
        "sector": sector,
        "sub_sector": tagline.split()[0],
        "geography": hq,
        "stage": stage,
        "business_model": model,
        "description": f"{name} is building the {tagline}.",
        "tagline": tagline,
        "deal_type": "active",
        "is_public_benchmark": False,
        "status": "In Progress" if random.random() > 0.3 else "New",
        
        # Deep data payload
        "metrics": {
            "arr": arr,
            "valuation": val,
            "employees": employees,
            "burn_rate": burn,
            "runway_months": runway,
            "cash_on_hand": cash,
            "yoy_growth": random.randint(80, 300),
            "gross_margin": random.randint(50, 90),
            "cac_payback_months": round(random.uniform(4, 18), 1),
            "nrr": random.randint(100, 140)
        },
        "founders": founder_bios,
        "investors": random.sample(INVESTORS, random.randint(1, 3)),
        "competitors": [related_company],
        "timeline": timeline,
        "analysis": {
            "overall_score": random.randint(65, 95),
            "recommendation": "Proceed to Partner Review" if arr > 3000000 else "Track for next round",
            "risks": [
                {"category": "Market", "description": "High competition from incumbents."},
                {"category": "Execution", "description": "Aggressive burn rate requires flawless execution."}
            ]
        }
    })
    id_counter += 1

with open("extended_deals.json", "w") as f:
    json.dump(deals, f, indent=2)

print("Generated 30 detailed startups in extended_deals.json")
