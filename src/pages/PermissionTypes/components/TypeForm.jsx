import { useState, useEffect } from "react";
import api from "../../../shared/Api/Api";

export default function TypeForm({ permissionType, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    requires_reason: 0,
    requires_evidence: 0,
    max_duration_hours: 0,
    min_duration_hours: 0,
    max_requests_per_month: 0,
    max_requests_per_year: 0,
    max_hours_per_month: 0,
    max_hours_per_year: 0,
    is_paid: 0,
    requires_authorization: 0,
  });

  useEffect(() => {
    if (permissionType) {
      const { code, status, registration_date, ...rest } = permissionType;

      setForm({
        ...rest,
        requires_reason: Number(rest.requires_reason),
        requires_evidence: Number(rest.requires_evidence),
        is_paid: Number(rest.is_paid),
        requires_authorization: Number(rest.requires_authorization),
      });
    }
  }, [permissionType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (checked ? 1 : 0) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (permissionType) {
        await api.put(`/permission_types/${permissionType.identifier}`, form);
      } else {
        await api.post("/permission_types", form);
      }
      onClose(true);
    } catch (error) {
      console.error("Error al guardar tipo de permiso:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {permissionType ? "Editar Tipo de Permiso" : "Nuevo Tipo de Permiso"}
        </h2>

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del tipo de permiso"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            required
          />
        </div>

        {/* Duración */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Duración máx. (horas)</label>
            <input
              type="number"
              name="max_duration_hours"
              value={form.max_duration_hours}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              step="0.01"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Duración mín. (horas)</label>
            <input
              type="number"
              name="min_duration_hours"
              value={form.min_duration_hours}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              step="0.01"
            />
          </div>
        </div>

        {/* Límites */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "max_requests_per_month", label: "Solicitudes/mes" },
            { name: "max_requests_per_year", label: "Solicitudes/año" },
            { name: "max_hours_per_month", label: "Horas/mes" },
            { name: "max_hours_per_year", label: "Horas/año" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">{item.label}</label>
              <input
                type="number"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del tipo de permiso"
            className="border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Checks */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "requires_reason", label: "Requiere motivo" },
            { name: "requires_evidence", label: "Requiere evidencia" },
            { name: "is_paid", label: "Es pagado" },
            { name: "requires_authorization", label: "Requiere autorización" },
          ].map((option) => (
            <label key={option.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={option.name}
                checked={form[option.name] === 1}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
              {option.label}
            </label>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
