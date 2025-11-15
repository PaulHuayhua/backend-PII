from app import db
from app.models.permission_type import PermissionType
from datetime import datetime
import re, unicodedata, os
from google import genai

# ============================================================
# 🔹 Función auxiliar IA (se intenta primero con Gemini)
# ============================================================

def generate_code_ai(name: str):
    """Genera un código corto tipo ABC_DEF usando IA de Google Gemini."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ [IA DESACTIVADA] No se encontró la variable GEMINI_API_KEY.")
        return None

    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""
        Genera un código corto, claro y profesional (máx 7 caracteres, con guion bajo) para clasificar un tipo de permiso.
        Ejemplos:
        - Emergencia médica → MED_EME
        - Examen médico → MED_EXA
        - Permiso familiar → FAM_PER
        - Vacaciones → VAC_NOR
        Devuélveme solo el código, sin texto adicional.
        Tipo de permiso: "{name}"
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        code = response.text.strip().upper()
        print(f"✅ [IA OK] Código generado por Gemini: {code}")
        return code

    except Exception as e:
        print(f"⚠️ [IA ERROR] No se pudo generar código por Gemini: {e}")
        return None


# ============================================================
# 🔹 Función auxiliar local (respaldo si la IA falla)
# ============================================================

def generate_permission_code(name: str):
    """Genera un código corto único basado en el nombre, con prefijo correlativo."""
    if not name:
        return "UNK-00"

    # Limpieza de caracteres especiales
    name_clean = ''.join(
        c for c in unicodedata.normalize('NFD', name.upper())
        if unicodedata.category(c) != 'Mn'
    )
    words = re.findall(r'\b\w+', name_clean)
    prefix = (''.join(w[0] for w in words[:3]) if len(words) > 1 else words[0][:3])[:3]

    # Buscar último código con el mismo prefijo
    last_code = (
        PermissionType.query
        .filter(PermissionType.code.like(f"{prefix}-%"))
        .order_by(PermissionType.identifier.desc())
        .first()
    )

    # Generar correlativo
    next_number = 1
    if last_code and last_code.code:
        try:
            next_number = int(last_code.code.split("-")[-1]) + 1
        except ValueError:
            pass

    local_code = f"{prefix}-{next_number:02d}"
    print(f"🧩 [LOCAL] Código generado localmente: {local_code}")
    return local_code


# ============================================================
# 🔹 CRUD principal de PermissionType
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
    if not data.get("name"):
        raise ValueError("El campo 'name' es obligatorio.")

    # 🔹 Primero intentar con Gemini
    code = generate_code_ai(data.get("name"))

    # 🔹 Si la IA no responde, usar método local
    if not code:
        code = generate_permission_code(data.get("name"))
        print(f"⚙️ [RESGUARDO] Se usó código local: {code}")

    new_permission_type = PermissionType(
        code=code,
        name=data.get("name"),
        description=data.get("description"),
        requires_reason=data.get("requires_reason", 0),
        requires_evidence=data.get("requires_evidence", 0),
        max_duration_hours=data.get("max_duration_hours", 0),
        min_duration_hours=data.get("min_duration_hours", 0),
        max_requests_per_month=data.get("max_requests_per_month", 0),
        max_requests_per_year=data.get("max_requests_per_year", 0),
        max_hours_per_month=data.get("max_hours_per_month", 0),
        max_hours_per_year=data.get("max_hours_per_year", 0),
        is_paid=data.get("is_paid", 0),
        requires_authorization=data.get("requires_authorization", 0),
        registration_date=datetime.now(),
        status="A"
    )

    db.session.add(new_permission_type)
    db.session.commit()

    print(f"✅ [CREADO] Tipo de permiso '{new_permission_type.name}' registrado con código {new_permission_type.code}")
    return new_permission_type.to_dict()


def update(identifier, data):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type:
        return None

    for field, value in data.items():
        if hasattr(permission_type, field) and field != "identifier":
            setattr(permission_type, field, value)

    db.session.commit()
    return permission_type.to_dict()


def delete_logical(identifier):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type or permission_type.status != "A":
        return False
    permission_type.status = "I"
    db.session.commit()
    return True


def restore(identifier):
    permission_type = PermissionType.query.get(identifier)
    if not permission_type or permission_type.status == "A":
        return False
    permission_type.status = "A"
    db.session.commit()
    return True
