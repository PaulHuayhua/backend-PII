from app import db
from app.models.permission_type import PermissionType
from datetime import datetime
import re, unicodedata, os
from google import genai

# ============================================================
# 🔹 Generación local de código
# ============================================================
def generate_permission_code(name: str):
    if not name:
        return "UNK-00"

    name_clean = ''.join(
        c for c in unicodedata.normalize('NFD', name.upper())
        if unicodedata.category(c) != 'Mn'
    )

    words = re.findall(r'\b\w+', name_clean)
    prefix = (''.join(w[0] for w in words[:3]) if len(words) > 1 else words[0][:3])[:3]

    last_code = (
        PermissionType.query
        .filter(PermissionType.code.like(f"{prefix}-%"))
        .order_by(PermissionType.identifier.desc())
        .first()
    )

    next_number = 1
    if last_code and last_code.code:
        try:
            next_number = int(last_code.code.split("-")[-1]) + 1
        except:
            pass

    local_code = f"{prefix}-{next_number:02d}"
    print(f"🧩 Código local: {local_code}")
    return local_code

# ============================================================
# 🔹 Corrección automática de descripción con IA
# ============================================================
def correct_description_ai(description: str):
    if not description:
        return description

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ GEMINI_API_KEY no encontrado. Se usará la descripción original.")
        return description

    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""
        Corrige errores de ortografía, puntuación y redacción.
        Mantén el significado original.
        Devuelve solo la versión corregida y profesional.
        Descripción original: "{description}"
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        corrected = response.text.strip()
        print(f"📝 Descripción corregida: {corrected}")
        return corrected

    except Exception as e:
        # Si la IA falla, no interrumpe el flujo
        print(f"⚠️ Error corrigiendo descripción: {e}. Se usará la descripción original.")
        return description

# ============================================================
# 🔹 CRUD
# ============================================================
def get_all(active_only=True, status=None):
    query = PermissionType.query
    if active_only:
        query = query.filter(PermissionType.status == "A")
    if status:
        query = query.filter(PermissionType.status == status)
    return [p.to_dict() for p in query.order_by(PermissionType.identifier.asc()).all()]

def get_by_id(identifier):
    permission_type = PermissionType.query.get(identifier)
    return permission_type.to_dict() if permission_type else None

def create(data):
    # --- Convertidores seguros ---
    def to_int(value):
        try:
            return int(value)
        except:
            return 0

    def to_float(value):
        try:
            return float(value)
        except:
            return 0.0

    # --- Generación de código local ---
    name = data.get("name", "")
    code = generate_permission_code(name)

    # --- Corrección de descripción ---
    description = correct_description_ai(data.get("description"))

    # --- Crear objeto ---
    new_permission_type = PermissionType(
        code=code,
        name=name,
        description=description,
        requires_reason=to_int(data.get("requires_reason")),
        requires_evidence=to_int(data.get("requires_evidence")),
        max_duration_hours=to_float(data.get("max_duration_hours")),
        min_duration_hours=to_float(data.get("min_duration_hours")),
        max_requests_per_month=to_int(data.get("max_requests_per_month")),
        max_requests_per_year=to_int(data.get("max_requests_per_year")),
        max_hours_per_month=to_int(data.get("max_hours_per_month")),
        max_hours_per_year=to_int(data.get("max_hours_per_year")),
        is_paid=to_int(data.get("is_paid")),
        requires_authorization=to_int(data.get("requires_authorization")),
        registration_date=datetime.now(),
        status="A"
    )

    db.session.add(new_permission_type)
    db.session.commit()

    print(f"✅ Creado permiso {new_permission_type.code}")
    return new_permission_type.to_dict()

def update(identifier, data):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type:
        return None

    protected = {"identifier", "code", "status", "registration_date"}

    for field, value in data.items():
        if hasattr(permission_type, field) and field not in protected:
            if field == "description":
                value = correct_description_ai(value)
            setattr(permission_type, field, value)

    db.session.commit()
    return permission_type.to_dict()

def delete_logical(identifier):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type:
        return False
    if permission_type.status == "I":
        return False
    permission_type.status = "I"
    db.session.commit()
    return True

def restore(identifier):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type:
        return False
    if permission_type.status == "A":
        return False
    permission_type.status = "A"
    db.session.commit()
    return True
