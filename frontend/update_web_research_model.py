import re

file_path = '../backend/db/models.py'
with open(file_path, 'r') as f:
    content = f.read()

replacement = """class WebResearchBriefModel(Base):
    __tablename__ = "web_research_briefs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    company_name = Column(String)
    research_mode = Column(String)
    source_quality_score = Column(Integer)
    public_data_confidence = Column(String)
    queries_json = Column(Text)
    sources_json = Column(Text)
    claims_json = Column(Text)
    evidence_graph_json = Column(Text)
    conflicts_json = Column(Text)
    unknown_metrics_json = Column(Text)
    synthesis_json = Column(Text)
    citations_json = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)"""

content = re.sub(r'class WebResearchBriefModel\(Base\):.*?created_at = Column\(DateTime, default=datetime.utcnow\)', replacement, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

