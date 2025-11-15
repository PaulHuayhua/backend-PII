import { useState, useEffect } from "react";
import api from "../../../shared/Api/Api";
import { Eye, Edit, Trash2, RefreshCw } from "lucide-react";

export default function PermitList({ onEdit, onView, onCreate }) {
  const [permits, setPermits] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Cargar trabajadores
  const fetchWorkers = async () => {
    try {
      const res = await api.get("/workers/");
      setWorkers(res.data);
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
    }
  };

  // Cargar permisos
  const fetchPermits = async () => {
    try {
      const res = await api.get("/permit_tickets/?include_inactive=1");
      const mapped = res.data.map((p) => {
        const workerData = workers.find((w) => w.identifier === p.workers_identifier) || {};
        return {
          ...p,
          worker: {
            name: workerData.first_name || "Desconocido",
            last_name: workerData.last_name || "",
            area: workerData.job_title || "Área desconocida",
          },
        };
      });
      setPermits(mapped);
    } catch (err) {
      console.error("Error cargando permisos:", err);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);
  useEffect(() => { if(workers.length > 0) fetchPermits(); }, [workers]);

  const handleToggleActive = async (permit) => {
    const action = permit.active ? "eliminar" : "restaurar";
    if (!window.confirm(`¿Deseas ${action} este permiso?`)) return;

    try {
      if (permit.active) {
        await api.delete(`/permit_tickets/${permit.identifier}`);
      } else {
        await api.put(`/permit_tickets/restore/${permit.identifier}`);
      }
      fetchPermits();
    } catch (err) {
      console.error(`Error al ${action} permiso:`, err);
    }
  };

  const filteredPermits = permits.filter(p => {
    if (statusFilter === "all") return true;
    if (statusFilter === "cancelled") return p.active === 0;
    return p.ticket_status === statusFilter;
  });

  const getStatusColor = (permit) => {
    const estado = permit.active === 0 ? "cancelled" : permit.ticket_status;
    return estado === "cancelled" ? "bg-red-500"
      : estado === "Pendiente" ? "bg-gray-400"
      : estado === "Firmado por Jefe" ? "bg-blue-500"
      : estado === "Firmado por Administración" ? "bg-yellow-500"
      : estado === "Validado por RR.HH" ? "bg-green-500"
      : "bg-gray-400";
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Boleta de Permisos</h2>
        <button
          onClick={onCreate}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 transition"
        >
          Nuevo Permiso
        </button>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <p className="text-gray-600">Filtrar por estado:</p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Firmado por Jefe">Firmado por Jefe</option>
          <option value="Firmado por Administración">Firmado por Administración</option>
          <option value="Validado por RR.HH">Validado por RR.HH</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-gray-800 text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="py-2 px-3">Trabajador</th>
              <th className="py-2 px-3">Área</th>
              <th className="py-2 px-3">Motivo</th>
              <th className="py-2 px-3">Fecha</th>
              <th className="py-2 px-3">Estado</th>
              <th className="py-2 px-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermits.length > 0 ? filteredPermits.map(p => (
              <tr key={p.identifier} className={`border-b hover:bg-gray-50 transition-colors ${!p.active ? "opacity-50" : ""}`}>
                <td className="py-3 px-5">{p.worker.name} {p.worker.last_name}</td>
                <td className="py-3 px-5">{p.worker.area}</td>
                <td className="py-3 px-5">{p.reason}</td>
                <td className="py-3 px-5">{p.application_date ? new Date(p.application_date).toLocaleDateString() : "-"}</td>
                <td className="py-3 px-5">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full text-white ${getStatusColor(p)}`}>
                    {p.ticket_status}
                  </span>
                </td>
                <td className="py-3 px-5 flex justify-center gap-2">
                  <button onClick={() => onView(p)} className="bg-blue-600 text-white p-2 rounded"><Eye size={18} /></button>
                  {p.active && <button onClick={() => onEdit(p)} className="bg-yellow-500 text-white p-2 rounded"><Edit size={18} /></button>}
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`${p.active ? "bg-red-500" : "bg-green-500"} text-white p-2 rounded`}
                  >
                    {p.active ? <Trash2 size={18} /> : <RefreshCw size={18} />}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4 italic">
                  No hay solicitudes registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
