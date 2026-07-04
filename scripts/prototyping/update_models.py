import re

with open("backend/models/__init__.py", "r") as f:
    content = f.read()

new_models = """

class AgentWorkflowRunModel(Base):
    __tablename__ = "agent_workflow_runs"

    run_id = Column(String, primary_key=True, index=True)
    deal_id = Column(String, index=True)
    company_name = Column(String)
    workflow_mode = Column(String)
    status = Column(String)
    agents_run = Column(String)  # JSON list
    trace = Column(String)       # JSON string of trace steps
    final_report = Column(String) # JSON
    metadata_blob = Column(String) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentTraceModel(Base):
    __tablename__ = "agent_traces"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    run_id = Column(String, index=True)
    agent_name = Column(String)
    status = Column(String)
    output = Column(String) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
"""

if "AgentWorkflowRunModel" not in content:
    content += new_models
    with open("backend/models/__init__.py", "w") as f:
        f.write(content)
