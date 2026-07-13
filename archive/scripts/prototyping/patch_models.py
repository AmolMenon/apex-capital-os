with open("backend/models/__init__.py", "r") as f:
    content = f.read()

# Add new models
new_models = """

class DealDataRoomDocument(Base):
    __tablename__ = "deal_data_room_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    file_name = Column(String)
    file_type = Column(String)
    document_category = Column(String)
    upload_time = Column(DateTime, default=datetime.utcnow)
    file_size = Column(Integer)
    storage_path = Column(String)
    parse_status = Column(String)
    uploaded_by = Column(String)
    metadata_json = Column(Text, default="{}")

class DealDataRoomReport(Base):
    __tablename__ = "deal_data_room_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), unique=True)
    report_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
"""

if "DealDataRoomDocument" not in content:
    content += new_models
    with open("backend/models/__init__.py", "w") as f:
        f.write(content)
