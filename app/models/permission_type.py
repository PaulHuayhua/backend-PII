from app import db
from sqlalchemy import Column, Integer, String, DateTime, Numeric
from sqlalchemy.orm import relationship

class PermissionType(db.Model):
    __tablename__ = 'permission_type'

    identifier = Column(Integer, primary_key=True)
    code = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(300))
    requires_reason = Column(Integer, nullable=False)
    requires_evidence = Column(Integer, nullable=False)
    max_duration_hours = Column(Numeric(5,2), nullable=False)
    min_duration_hours = Column(Numeric(5,2), nullable=False)
    max_requests_per_month = Column(Integer, nullable=False)
    max_requests_per_year = Column(Integer, nullable=False)
    max_hours_per_month = Column(Integer, nullable=False)
    max_hours_per_year = Column(Integer, nullable=False)
    is_paid = Column(Integer, nullable=False)
    requires_authorization = Column(Integer, nullable=False)
    registration_date = Column(DateTime, nullable=False)
    status = Column(String(1), nullable=False)

    tickets = relationship("PermitTicket", back_populates="permission_type")

    def to_dict(self):
        return {
            "identifier": self.identifier,
            "code": self.code,
            "name": self.name,
            "description": self.description,
            "requires_reason": self.requires_reason,
            "requires_evidence": self.requires_evidence,
            "max_duration_hours": float(self.max_duration_hours),
            "min_duration_hours": float(self.min_duration_hours),
            "max_requests_per_month": self.max_requests_per_month,
            "max_requests_per_year": self.max_requests_per_year,
            "max_hours_per_month": self.max_hours_per_month,
            "max_hours_per_year": self.max_hours_per_year,
            "is_paid": self.is_paid,
            "requires_authorization": self.requires_authorization,
            "registration_date": self.registration_date.isoformat() if self.registration_date else None,
            "status": self.status,
        }
