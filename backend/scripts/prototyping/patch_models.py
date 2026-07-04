import re

with open("db/models.py", "r") as f:
    content = f.read()

# Add columns to ReasoningRun
# find class ReasoningRun(Base):
pattern = r'(class ReasoningRun\(Base\):\n\s+__tablename__ = "reasoning_runs"\n\s+id = Column\(Integer, primary_key=True, autoincrement=True\))'

replacement = r'\1\n    experiment_batch_id = Column(String, index=True, nullable=True)\n    grading_status = Column(String, default="PENDING")\n    grader_failure_reason = Column(String, nullable=True)'

new_content = re.sub(pattern, replacement, content)

with open("db/models.py", "w") as f:
    f.write(new_content)
