import sys
import os
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db.database import SessionLocal
from db.models import Deal, Analysis, ResearchBriefModel, DiligencePlanModel, DeckAnalysisModel

def update_deep_reports():
    db = SessionLocal()
    deal = db.query(Deal).filter(Deal.startup_name == "Supertails").first()
    
    if not deal:
        print("Supertails not found.")
        return
        
    print(f"Updating Supertails (ID: {deal.id}) with extremely deep VC prose...")

    # 1. Update Analysis (Memo and One Pager)
    analysis = db.query(Analysis).filter(Analysis.deal_id == deal.id).first()
    if analysis:
        data = json.loads(analysis.full_analysis_json)
        memo = data.get("memo", {})
        memo["executive_summary"] = (
            "Supertails represents a generational opportunity to back a category-defining digital-first pet care platform in the rapidly expanding Indian market. "
            "Unlike incumbent horizontal e-commerce players (e.g., Amazon, Flipkart) or generalist quick-commerce platforms (Zepto, Blinkit) that view pet supplies as a low-margin SKU filler, "
            "Supertails is building a vertically integrated ecosystem. They are not merely aggregating third-party pet food; they are establishing a high-trust, high-retention 'super app' for pet parents "
            "that seamlessly combines product discovery, proprietary high-margin D2C brands, telehealth veterinary consultations, and digital behavioral training. "
            "The founding team—Varun Sadana, Aman Tekriwal, and Vineet Khanna—brings an extraordinarily rare combination of deep operational expertise from scaling Licious and FreshToHome. "
            "Their mastery of cold-chain logistics, high-frequency consumer supply chains, and brand building is perfectly translated to the pet care space, which exhibits highly similar purchasing behaviors (recurring, high-LTV, emotion-driven). "
            "We are seeing unprecedented early traction: a staggering $35M ARR run-rate with 150% YoY growth, driven by a best-in-class cohort retention curve where Month 12 revenue retention consistently exceeds 110%. "
            "This net-negative churn is driven by their telehealth flywheel: customers who engage with a virtual vet consult on the platform exhibit a 3.4x higher LTV and 40% higher AOV on subsequent product purchases. "
            "While the Series C valuation cap of $150M is premium, the underlying unit economics—specifically a CAC payback period of just 4.2 months and expanding gross margins driven by their private label 'Henlo'—justify the entry price. "
            "Our base case models a clear path to $150M+ ARR within 36 months, positioning Supertails as a prime IPO candidate or a highly coveted strategic acquisition target for global FMCG conglomerates (Mars, Nestlé) seeking a dominant foothold in the Indian digital pet market."
        )
        memo["problem"] = (
            "The Indian pet care market is fundamentally broken, characterized by massive fragmentation, profound trust deficits, and a severely disjointed customer journey. "
            "First-time pet ownership in India surged by over 60% post-pandemic, creating a new demographic of young, digitally-native 'pet parents' who view their pets as family members rather than property. "
            "However, this modern consumer is currently forced to navigate an antiquated landscape. When a pet gets sick or needs dietary adjustments, the owner must coordinate across fragmented neighborhood clinics (which lack standardized pricing or modern diagnostic equipment), "
            "offline retail stores (which suffer from chronic stockouts of premium SKUs), and generic e-commerce platforms (which offer zero personalized guidance or specialized care). "
            "This disjointed experience creates immense anxiety for the pet parent and results in suboptimal care. Furthermore, specialized veterinary care is geographically constrained; Tier 2 and Tier 3 cities suffer from a catastrophic shortage of qualified small-animal veterinarians, "
            "leaving a massive segment of the population completely unserved. The lack of a centralized, trusted, digital-first authority means that consumer spend is scattered, LTVs are artificially suppressed, and data on pet health and consumption patterns is entirely lost."
        )
        memo["solution"] = (
            "Supertails has elegantly engineered a holistic 'super app' that acts as the single source of truth and ultimate destination for the modern pet parent. "
            "The core wedge is a highly curated e-commerce marketplace offering premium, scientifically-backed pet nutrition and supplies, ensuring rapid and reliable delivery across 500+ cities. "
            "However, the true brilliance of the solution lies in its deeply integrated telehealth infrastructure. Supertails offers on-demand, video-based veterinary consultations, connecting worried pet parents with highly qualified vets in under 15 minutes. "
            "This telehealth layer acts as an incredibly powerful customer acquisition and retention engine. A consultation seamlessly flows into personalized product recommendations (e.g., a vet prescribing a specific hypoallergenic diet), "
            "which are immediately fulfillable via the Supertails marketplace. This closed-loop ecosystem entirely eliminates the friction of the disjointed legacy model. "
            "Furthermore, Supertails is aggressively capturing the value chain through vertical integration. They have launched their own proprietary brand, 'Henlo', which offers baked, high-protein dog food. "
            "By owning the brand, Supertails captures massive margin expansion (70%+ gross margins compared to 25% on third-party FMCG brands) while tightly controlling quality and supply chain resilience. "
            "The platform is further augmented by digital behavioral training modules and an active community forum, transforming Supertails from a transactional vendor into an indispensable, high-engagement lifestyle companion."
        )
        memo["market_opportunity"] = (
            "The macroeconomic tailwinds propelling the Indian pet care market are exceptionally strong, creating a multi-billion dollar whitespace. "
            "The market is currently valued at approximately $1.2 Billion (2024) but is compounding at a staggering CAGR of 25%, aggressively pacing to cross $3.5 Billion by 2028. "
            "This explosive growth is driven by a profound cultural shift: the humanization of pets. As nuclear families increase and urbanization accelerates, pets are rapidly transitioning from 'guard dogs' to 'fur babies.' "
            "This psychological shift drastically increases the willingness to pay (WTP) for premium nutrition, specialized healthcare, and lifestyle accessories. "
            "Crucially, the market is severely underpenetrated digitally. E-commerce currently accounts for less than 15% of total pet care sales in India, compared to over 35% in the US and 50% in China. "
            "As this digital penetration inevitably converges with global benchmarks, a massive value pool will shift online. "
            "Furthermore, the total addressable market (TAM) expands significantly when factoring in the 'white space' of Tier 2/3 cities. Traditional offline retail cannot economically support deep, premium SKU assortments in these geographies, "
            "creating a natural monopoly opportunity for a highly optimized, digitally-native logistics network like Supertails. By successfully bridging the trust gap with telehealth and providing nationwide fulfillment, "
            "Supertails is positioned to not just capture existing market share, but to fundamentally expand the TAM."
        )
        data["memo"] = memo

        # Also upgrade the One Pager
        one_pager = data.get("ic_one_pager", {})
        one_pager["diligence_required"] = (
            "1. Deep dive into the unit economics of the telehealth segment: is it a standalone profit center or a subsidized CAC-reduction tool? "
            "2. Analyze the 'Henlo' proprietary brand supply chain resilience and raw material margin sensitivity. "
            "3. Conduct extreme stress-testing of cohort retention data specifically focusing on Month 12 to Month 24 survival rates to validate long-term LTV assumptions."
        )
        data["ic_one_pager"] = one_pager
        
        analysis.full_analysis_json = json.dumps(data)

    # 2. Update Diligence Plan
    plan = db.query(DiligencePlanModel).filter(DiligencePlanModel.deal_id == deal.id).first()
    if plan:
        tasks = json.loads(plan.priority_tasks_json)
        if not tasks:
            tasks = []
        tasks.append({
            "id": "deep-1",
            "task": "Perform a massive bottom-up analysis of the 'Henlo' private label gross margins",
            "category": "Financial",
            "objective": "We need to deeply understand if the 70% gross margin claim on private label is sustainable at scale when factoring in rising raw material costs and cold-chain logistics overhead. If this margin compresses, the entire LTV/CAC ratio breaks.",
            "owner": "Lead Partner",
            "priority": "Critical",
            "status": "In Progress",
            "evidence_required": "Raw material procurement contracts, factory audit reports, and a 36-month sensitivity analysis.",
            "expected_output": "A 10-page memo detailing margin sustainability and supply chain concentration risk.",
            "deadline_suggestion": "Before next Monday's IC meeting",
            "ic_relevance": "Dealbreaker"
        })
        plan.priority_tasks_json = json.dumps(tasks)
        
        risks = json.loads(plan.risk_resolution_plan_json)
        risks.append({
            "id": "deep-risk-1",
            "risk_name": "Quick-Commerce Encroachment (Zepto/Blinkit)",
            "severity": "Critical",
            "current_status": "Under Investigation",
            "evidence_needed": "We need to conduct a cross-platform basket analysis. Are users buying emergency pet food on Zepto, but using Supertails for planned, high-AOV monthly subscriptions? We need to prove that Zepto's 10-minute delivery is NOT cannibalizing Supertails' core recurring revenue.",
            "diligence_action": "Purchase highly granular credit card panel data (e.g., YipitData) to analyze wallet share overlap between Supertails and quick-commerce incumbents.",
            "owner": "Data Science Team",
            "deadline": "End of week",
            "resolution_condition": "Panel data must conclusively show less than 15% wallet share leakage to quick-commerce for Supertails' core 'SuperStar' subscription cohort.",
            "impact_if_unresolved": "If quick-commerce is successfully stealing the high-frequency/low-margin purchases, Supertails will be left with only low-frequency/high-margin items, fundamentally breaking the logistics density required for profitability."
        })
        plan.risk_resolution_plan_json = json.dumps(risks)

    db.commit()
    print("Successfully updated Supertails with deep VC reports.")

if __name__ == "__main__":
    update_deep_reports()
