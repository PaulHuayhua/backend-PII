import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import api from "../../../shared/Api/Api";

export default function PermitForm({ permit, onClose, onSaved }) {
  const [workers, setWorkers] = useState([]);
  const [bosses, setBosses] = useState([]);
  const [permissionTypes, setPermissionTypes] = useState([]);

  const [form, setForm] = useState({
    workers_identifier: "",
    permission_type_identifier: "",
    reason: "",
    application_date: "",
    start_time: "",
    end_time: "",
    evidence_document: null,
    authorized_by: "",
    area_manager_signature: null,
    worker_signature: null,
    admin_approval: "0",
    ticket_status: "Pendiente",
  });

  const selectedType = permissionTypes.find(
    (t) => t.identifier == form.permission_type_identifier
  );

  const formatTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    api.get("/workers/").then((res) => {
      setWorkers(res.data);
      setBosses(
        res.data.filter((w) => w.is_area_boss === true || w.is_area_boss === 1)
      );
    });
  }, []);

  useEffect(() => {
    api.get("/permission_types/").then((res) => setPermissionTypes(res.data));
  }, []);

  useEffect(() => {
    if (permit) {
      setForm({
        workers_identifier: permit.workers_identifier || "",
        permission_type_identifier: permit.permission_type_identifier || "",
        reason: permit.reason || "",
        application_date: permit.application_date?.slice(0, 10) || "",
        start_time: formatTime(permit.start_time),
        end_time: formatTime(permit.end_time),
        evidence_document: null, // archivo nuevo opcional
        authorized_by: permit.authorized_by || "",
        area_manager_signature: null,
        worker_signature: null,
        admin_approval: permit.admin_approval?.toString() || "0",
        ticket_status: permit.ticket_status || "Pendiente",
      });
    }
  }, [permit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    // campos normales
    ["workers_identifier", "permission_type_identifier", "reason", "application_date",
      "authorized_by", "admin_approval", "ticket_status"].forEach(key => {
      payload.append(key, form[key]);
    });

    // campos de hora
    if (form.application_date && form.start_time)
      payload.set("start_time", `${form.application_date} ${form.start_time}:00`);
    if (form.application_date && form.end_time)
      payload.set("end_time", `${form.application_date} ${form.end_time}:00`);

    // archivos opcionales: solo si hay un archivo nuevo
    ["evidence_document", "area_manager_signature", "worker_signature"].forEach(key => {
      if (form[key]) payload.append(key, form[key]);
    });

    try {
      if (permit) {
        await api.put(`/permit_tickets/${permit.identifier}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/permit_tickets/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el permiso.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {permit ? "Editar Permiso" : "Nuevo Permiso"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Trabajador */}
          <div>
            <label className="block text-sm font-medium mb-1">Trabajador</label>
            <select
              name="workers_identifier"
              value={form.workers_identifier}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccione</option>
              {workers.map((w) => (
                <option key={w.identifier} value={w.identifier}>
                  {w.first_name} {w.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de permiso */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de permiso</label>
            <select
              name="permission_type_identifier"
              value={form.permission_type_identifier}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccione</option>
              {permissionTypes.map((t) => (
                <option key={t.identifier} value={t.identifier}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Motivo */}
          {selectedType?.requires_reason === 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">Motivo</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full border rounded px-2 py-1"
              />
            </div>
          )}

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="application_date"
              value={form.application_date}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hora inicio</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora fin</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Archivos */}
          {selectedType?.requires_evidence === 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">Documento evidencia</label>
              <input
                type="file"
                name="evidence_document"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFile}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          )}

          {selectedType?.requires_authorization === 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">Autorizado por (Jefe de área)</label>
              <select
                name="authorized_by"
                value={form.authorized_by}
                onChange={handleChange}
                required
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Seleccione</option>
                {bosses.map((b) => (
                  <option key={b.identifier} value={b.identifier}>{b.first_name} {b.last_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Firma Jefe</label>
              <input
                type="file"
                name="area_manager_signature"
                accept="image/*"
                onChange={handleFile}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Firma trabajador</label>
              <input
                type="file"
                name="worker_signature"
                accept="image/*"
                onChange={handleFile}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Aprobación Administración</label>
              <select
                name="admin_approval"
                value={form.admin_approval}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="0">No</option>
                <option value="1">Sí</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="ticket_status"
                value={form.ticket_status}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Firmado por Jefe">Firmado por Jefe</option>
                <option value="Firmado por Administración">Firmado por Administración</option>
                <option value="Validado por RR.HH">Validado por RR.HH</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 flex items-center gap-2"
            >
              <Send size={16} />
              {permit ? "Actualizar" : "Enviar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
