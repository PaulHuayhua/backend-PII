from app import db
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class PermitTicket(db.Model):
    __tablename__ = 'permit_ticket'

    identifier = Column(Integer, primary_key=True)
    application_date = Column(Date, nullable=False)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    evidence_document = Column(String(500), nullable=False)
    reason = Column(String(300))
    authorized_by = Column(String(150), nullable=False)
    area_manager_signature = Column(String(200), nullable=False)
    worker_signature = Column(String(200), nullable=False)
    admin_approval = Column(String(1), nullable=False)
    created_at = Column(DateTime, nullable=False)
    ticket_status = Column(String(50), nullable=False)

    permission_type_identifier = Column(Integer, ForeignKey('permission_type.identifier'), nullable=False)
    workers_identifier = Column(Integer, ForeignKey('workers.identifier'), nullable=False)  # apunta a workers

    permission_type = relationship("PermissionType", back_populates="tickets")
    worker = relationship("Worker", back_populates="permit_tickets")

    def to_dict(self):
        return {
            "identifier": self.identifier,
            "application_date": self.application_date.isoformat() if self.application_date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "evidence_document": self.evidence_document,
            "reason": self.reason,
            "authorized_by": self.authorized_by,
            "area_manager_signature": self.area_manager_signature,
            "worker_signature": self.worker_signature,
            "admin_approval": self.admin_approval,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "ticket_status": self.ticket_status,
            "permission_type_identifier": self.permission_type_identifier,
            "workers_identifier": self.workers_identifier
        }
