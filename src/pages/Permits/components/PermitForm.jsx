import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import api from "../../../shared/Api/Api";

export default function PermitForm({ permit, onClose, onSaved }) {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    workers_identifier: "",
    reason: "",
    application_date: "",
    start_time: "",
    end_time: "",
    evidence_document: "",
    authorized_by: "",
    area_manager_signature: "",
    worker_signature: "",
    admin_approval: "0",
    ticket_status: "Pendiente",
    permission_type_identifier: "",
  });

  // Formatear hora de datetime
  const formatTime = (datetime) => {
    if (!datetime) return "";
    const dt = new Date(datetime);
    return dt.toISOString().slice(11, 16);
  };

  // Cargar trabajadores
  useEffect(() => {
    async function fetchWorkers() {
      try {
        const res = await api.get("/workers/");
        setWorkers(res.data);
      } catch (err) {
        console.error("Error cargando trabajadores:", err);
      }
    }
    fetchWorkers();
  }, []);

  // Si es edición, llenar form
  useEffect(() => {
    if (permit) {
      setForm({
        workers_identifier: permit.workers_identifier || "",
        reason: permit.reason || "",
        application_date: permit.application_date || "",
        start_time: formatTime(permit.start_time),
        end_time: formatTime(permit.end_time),
        evidence_document: permit.evidence_document || "",
        authorized_by: permit.authorized_by || "",
        area_manager_signature: permit.area_manager_signature || "",
        worker_signature: permit.worker_signature || "",
        admin_approval: permit.admin_approval || "0",
        ticket_status: permit.ticket_status || "Pendiente",
        permission_type_identifier: permit.permission_type_identifier || "",
      });
    }
  }, [permit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      start_time: form.start_time ? `${form.application_date} ${form.start_time}:00` : null,
      end_time: form.end_time ? `${form.application_date} ${form.end_time}:00` : null,
    };

    try {
      if (permit) {
        await api.put(`/permit_tickets/${permit.identifier}`, payload);
      } else {
        await api.post("/permit_tickets/", payload);
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el permiso.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X size={22} /></button>
        <h2 className="text-xl font-semibold mb-4">{permit ? "Editar Permiso" : "Nuevo Permiso"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label>Trabajador</label>
            <select name="workers_identifier" value={form.workers_identifier} onChange={handleChange} required className="w-full border rounded px-2 py-1">
              <option value="">Selecciona un trabajador</option>
              {workers.map(w => (
                <option key={w.identifier} value={w.identifier}>{w.first_name} {w.last_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Motivo</label>
            <input type="text" name="reason" value={form.reason} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label>Fecha</label>
            <input type="date" name="application_date" value={form.application_date} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label>Hora inicio</label>
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label>Hora fin</label>
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>

          <div>
            <label>Documento evidencia</label>
            <input type="text" name="evidence_document" value={form.evidence_document} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label>Autorizado por</label>
            <input type="text" name="authorized_by" value={form.authorized_by} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 flex items-center gap-1"><Send size={16} /> {permit ? "Actualizar" : "Enviar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
