import os

models_content = """from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from db.database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "Admin"
    PARTNER = "Partner"
    PRINCIPAL = "Principal"
    ASSOCIATE = "Associate"
    ANALYST = "Analyst"
    FOUNDER = "Founder"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default=RoleEnum.VIEWER.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    deals_assigned = relationship("DealAssignment", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="user", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    website = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    sector = Column(String, nullable=True)
    geography = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    founders = relationship("Founder", back_populates="company", cascade="all, delete-orphan")
    deals = relationship("Deal", back_populates="company", cascade="all, delete-orphan")
    portfolio_record = relationship("PortfolioCompany", back_populates="company", uselist=False, cascade="all, delete-orphan")

class Founder(Base):
    __tablename__ = "founders"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True) # If they have an account
    name = Column(String)
    email = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    background = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="founders")
    user = relationship("User")

class Deal(Base):
    __tablename__ = "deals"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    status = Column(String, default="New", index=True)
    stage = Column(String, nullable=True) # Seed, Series A, etc
    funding_asking = Column(Float, nullable=True)
    valuation = Column(Float, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    company = relationship("Company", back_populates="deals")
    assignments = relationship("DealAssignment", back_populates="deal", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="deal", cascade="all, delete-orphan")
    memos = relationship("InvestmentMemo", back_populates="deal", cascade="all, delete-orphan")
    research_reports = relationship("ResearchReport", back_populates="deal", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="deal", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="deal", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="deal", cascade="all, delete-orphan")

class DealAssignment(Base):
    __tablename__ = "deal_assignments"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role = Column(String) # e.g. Lead, Analyst
    
    deal = relationship("Deal", back_populates="assignments")
    user = relationship("User", back_populates="deals_assigned")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String)
    file_url = Column(String)
    doc_type = Column(String) # Pitch Deck, Financials, etc
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="documents")
    uploader = relationship("User")

class InvestmentMemo(Base):
    __tablename__ = "investment_memos"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    content_json = Column(Text)
    status = Column(String, default="Draft") # Draft, Ready for IC, Approved, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="memos")
    author = relationship("User")

class ResearchReport(Base):
    __tablename__ = "research_reports"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    generated_by = Column(String) # AI agent id or User id
    report_type = Column(String) # Market, Competitor, Diligence
    content_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="research_reports")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    assignee_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    status = Column(String, default="Pending") # Pending, In Progress, Done
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="tasks")
    assignee = relationship("User")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    content = Column(Text)
    context_type = Column(String, nullable=True) # General, Diligence, Memo
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    decision = Column(String) # Invest, Pass, Abstain
    rationale = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="votes")
    user = relationship("User", back_populates="votes")

class PortfolioCompany(Base):
    __tablename__ = "portfolio_companies"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), unique=True)
    investment_date = Column(DateTime)
    amount_invested = Column(Float)
    equity_percentage = Column(Float, nullable=True)
    status = Column(String, default="Active") # Active, Exited, Written Off
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="portfolio_record")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, index=True)
    entity_type = Column(String)
    entity_id = Column(Integer, nullable=True)
    details_json = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

"""

with open('db/models.py', 'w') as f:
    f.write(models_content)
print("V4 models generated in db/models.py")
