from app import db

class Worker(db.Model):
    __tablename__ = "workers"

    identifier = db.Column(db.Integer, primary_key=True)
    document_type = db.Column(db.String(3), nullable=False)
    document_number = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    marital_status = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(9), nullable=False)
    address = db.Column(db.String(150), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    work_start_date = db.Column(db.Date, nullable=False)
    education_level = db.Column(db.String(80), nullable=False)
    profession = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(80), nullable=False)
    account_number = db.Column(db.String(40), nullable=False)
    pension_system = db.Column(db.String(3), nullable=False)
    afp_name = db.Column(db.String(100), nullable=False)
    onp_entry_date = db.Column(db.Date, nullable=False)
    registration_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(1), nullable=False, default='A')
    is_area_boss = db.Column(db.Integer, nullable=False, default=0)
    permit_tickets = db.relationship("PermitTicket", back_populates="worker")

    def to_dict(self):
        return {
            "identifier": self.identifier,
            "document_type": self.document_type,
            "document_number": self.document_number,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "marital_status": self.marital_status,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "province": self.province,
            "district": self.district,
            "department": self.department,
            "work_start_date": self.work_start_date.isoformat() if self.work_start_date else None,
            "education_level": self.education_level,
            "profession": self.profession,
            "job_title": self.job_title,
            "bank_name": self.bank_name,
            "account_type": self.account_type,
            "account_number": self.account_number,
            "pension_system": self.pension_system,
            "afp_name": self.afp_name,
            "onp_entry_date": self.onp_entry_date.isoformat() if self.onp_entry_date else None,
            "registration_date": self.registration_date.isoformat() if self.registration_date else None,
            "status": self.status,
            "is_area_boss": bool(self.is_area_boss)
        }
