import { useEffect, useState } from "react";
import { FaEdit, FaTrashRestore, FaTrashAlt, FaPlus, FaBroom } from "react-icons/fa";
import api from "../../../shared/Api/Api";
import TypeForm from "./TypeForm";

export default function TypeList() {
  const [types, setTypes] = useState([]);

  // Filtros
  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [durationTypeFilter, setDurationTypeFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const getTypes = async () => {
    try {
      const response = await api.get("/permission_types/?include_inactive=1");
      setTypes(response.data);
    } catch (error) {
      console.error("Error al obtener tipos:", error);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);

  const handleDeleteOrRestore = async (type) => {
    try {
      if (type.status === "A") {
        await api.delete(`/permission_types/${type.identifier}`);
      } else {
        await api.put(`/permission_types/restore/${type.identifier}`);
      }
      getTypes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedType(null);
    setShowForm(true);
  };

  const handleCloseForm = (refresh = false) => {
    setShowForm(false);
    setSelectedType(null);
    if (refresh) getTypes();
  };

  const cleanFilters = () => {
    setStatusFilter("");
    setNameFilter("");
    setDurationTypeFilter("");
  };

  // FILTRADO
  const filteredTypes = types.filter((t) => {
    if (statusFilter !== "" && t.status !== statusFilter) return false;

    if (nameFilter !== "" && !t.name.toLowerCase().includes(nameFilter.toLowerCase()))
      return false;

    // Filtrado por tipo de duración revisado
    if (durationTypeFilter !== "") {
      if (durationTypeFilter === "short" && t.max_duration_hours <= 4) return true;
      if (durationTypeFilter === "medium" && t.max_duration_hours > 4 && t.max_duration_hours <= 8) return true;
      if (durationTypeFilter === "long" && t.max_duration_hours > 8) return true;
      return false;
    }

    return true;
  });

  const getStatusText = (status) => (status === "A" ? "Activo" : "Inactivo");

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Tipos de Permiso
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Gestión y configuración de los permisos institucionales
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-800 
                     transition flex items-center gap-2 text-sm font-medium"
        >
          <FaPlus className="text-sm" /> Nuevo Tipo
        </button>
      </div>

      {/* FILTROS MEJORADOS */}
      <div className="p-5 mb-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Buscar por nombre */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Ej. Permiso médico"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="A">Activos</option>
              <option value="I">Inactivos</option>
            </select>
          </div>

          {/* Tipo de duración */}
          <div>
            <label className="text-sm text-gray-700 font-semibold">Tipo de duración</label>
            <select
              value={durationTypeFilter}
              onChange={(e) => setDurationTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="short">Corto (≤ 4 h)</option>
              <option value="medium">Medio (4–8 h)</option>
              <option value="long">Largo (&gt; 8 h)</option>
            </select>
          </div>

          {/* Limpiar filtros */}
          <div className="flex items-end">
            <button
              onClick={cleanFilters}
              className="bg-gray-200 text-gray-700 w-full px-3 py-2.5 rounded-xl shadow hover:bg-gray-300 
                         flex items-center justify-center gap-2 transition text-sm font-semibold"
            >
              <FaBroom /> Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {filteredTypes.length > 0 ? (
          filteredTypes.map((type) => (
            <div
              key={type.identifier}
              className="group bg-white border border-gray-100 rounded-2xl p-6 
                         shadow-md hover:shadow-xl hover:-translate-y-1 
                         transition-all duration-300 relative overflow-hidden"
            >
              {/* TOP BAR */}
              <div
                className={`absolute top-0 left-0 w-full h-1.5 
                    ${type.status === "A" ? "bg-green-500" : "bg-red-500"}`}
              ></div>

              {/* TITLE */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{type.name}</h3>
                  <p className="text-gray-500 text-sm">{type.code}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                    ${type.status === "A"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {getStatusText(type.status)}
                </span>
              </div>

              {/* DATA */}
              <div className="space-y-2 text-gray-700 text-sm">
                {type.description && (
                  <p>
                    <span className="font-semibold text-gray-900">Descripción: </span>
                    {type.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p><span className="font-semibold">Máx. Horas:</span> {type.max_duration_hours}</p>
                  <p><span className="font-semibold">Mín. Horas:</span> {type.min_duration_hours}</p>
                  <p><span className="font-semibold">Solic. Mes:</span> {type.max_requests_per_month}</p>
                  <p><span className="font-semibold">Solic. Año:</span> {type.max_requests_per_year}</p>
                  <p><span className="font-semibold">Horas/Mes:</span> {type.max_hours_per_month}</p>
                  <p><span className="font-semibold">Horas/Año:</span> {type.max_hours_per_year}</p>
                </div>

                <p className="pt-2 text-gray-400 text-xs">
                  Registrado el: {new Date(type.registration_date).toLocaleString()}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => handleEdit(type)}
                  className="text-yellow-700 bg-yellow-100 p-2.5 rounded-xl hover:bg-yellow-200 
                             border border-yellow-300 transition shadow-sm hover:shadow"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDeleteOrRestore(type)}
                  className={`p-2.5 rounded-xl border shadow-sm hover:shadow transition ${
                    type.status === "A"
                      ? "text-red-700 bg-red-100 hover:bg-red-200 border-red-300"
                      : "text-green-800 bg-green-100 hover:bg-green-200 border-green-300"
                  }`}
                >
                  {type.status === "A" ? <FaTrashAlt /> : <FaTrashRestore />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No se encontraron tipos de permiso.
          </p>
        )}
      </div>

      {showForm && (
        <TypeForm permissionType={selectedType} onClose={handleCloseForm} />
      )}
    </div>
  );
}
