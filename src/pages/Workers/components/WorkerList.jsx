import { useEffect, useState } from "react";
import { FaEdit, FaTrashRestore, FaTrashAlt, FaPlus, FaBroom } from "react-icons/fa";
import api from "../../../shared/Api/Api";
import WorkerFullForm from "./WorkerFullForm";

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const getWorkers = async () => {
    try {
      const response = await api.get("/workers/?include_inactive=1");
      setWorkers(response.data);
    } catch (error) {
      console.error("Error al obtener trabajadores:", error);
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  const handleDeleteOrRestore = async (worker) => {
    try {
      if (worker.status === "A") {
        // Cambiar DELETE por PATCH para borrado lógico
        await api.patch(`/workers/delete/${worker.identifier}`);
      } else {
        await api.patch(`/workers/restore/${worker.identifier}`);
      }
      getWorkers();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedWorker(null);
    setShowForm(true);
  };

  const handleCloseForm = (refresh = false) => {
    setShowForm(false);
    setSelectedWorker(null);
    if (refresh) getWorkers();
  };

  const cleanFilters = () => {
    setStatusFilter("");
    setSearchFilter("");
    setDocumentFilter("");
    setProfessionFilter("");
    setJobTitleFilter("");
    setDistrictFilter("");
  };

  const filteredWorkers = workers.filter((w) => {
    if (statusFilter && w.status !== statusFilter) return false;
    if (searchFilter &&
        !(w.first_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          w.last_name.toLowerCase().includes(searchFilter.toLowerCase()))
    ) return false;
    if (documentFilter && !w.document_number.includes(documentFilter)) return false;
    if (professionFilter &&
        !w.profession.toLowerCase().includes(professionFilter.toLowerCase())
    ) return false;
    if (jobTitleFilter &&
        !w.job_title.toLowerCase().includes(jobTitleFilter.toLowerCase())
    ) return false;
    if (districtFilter &&
        !w.district.toLowerCase().includes(districtFilter.toLowerCase())
    ) return false;
    return true;
  });

  const getStatusText = (status) => (status === "A" ? "Activo" : "Inactivo");

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Trabajadores</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestión completa del personal registrado</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-800 
                     transition flex items-center gap-2 text-sm font-medium"
        >
          <FaPlus className="text-sm" /> Nuevo Trabajador
        </button>
      </div>

      {/* FILTROS */}
      <div className="p-5 mb-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterInput label="Nombre o Apellido" value={searchFilter} setValue={setSearchFilter} placeholder="Ej. Carlos" />
          <FilterInput label="Documento" value={documentFilter} setValue={setDocumentFilter} placeholder="DNI / CE" />
          <FilterSelect label="Estado" value={statusFilter} setValue={setStatusFilter} options={[{label:'Todos', value:''},{label:'Activos', value:'A'},{label:'Inactivos', value:'I'}]} />
          <FilterInput label="Profesión" value={professionFilter} setValue={setProfessionFilter} placeholder="Ej. Contador" />
          <FilterInput label="Cargo" value={jobTitleFilter} setValue={setJobTitleFilter} placeholder="Ej. Asistente" />
          <FilterInput label="Distrito" value={districtFilter} setValue={setDistrictFilter} placeholder="Ej. Nuevo Chimbote" />
          <div className="flex items-end">
            <button
              onClick={cleanFilters}
              className="bg-gray-200 text-gray-700 w-full px-3 py-2.5 rounded-xl shadow hover:bg-gray-300 
                         flex items-center justify-center gap-2 transition text-sm font-semibold"
            >
              <FaBroom /> Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((w) => (
            <div
              key={w.identifier}
              className="group bg-white border border-gray-100 rounded-2xl p-6 
                         shadow-md hover:shadow-xl hover:-translate-y-1 
                         transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 ${w.status === "A" ? "bg-green-500" : "bg-red-500"}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{w.first_name} {w.last_name}</h3>
                  <p className="text-gray-500 text-sm">{w.document_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                  ${w.status === "A" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {getStatusText(w.status)}
                </span>
              </div>

              <div className="space-y-2 text-gray-700 text-sm">
                <p><span className="font-semibold text-gray-900">Cargo: </span>{w.job_title}</p>
                <p><span className="font-semibold text-gray-900">Profesión: </span>{w.profession}</p>
                <p><span className="font-semibold text-gray-900">Distrito: </span>{w.district}</p>
                <p className="pt-2 text-gray-400 text-xs">Registrado el: {new Date(w.registration_date).toLocaleString()}</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button onClick={() => handleEdit(w)} className="text-yellow-700 bg-yellow-100 p-2.5 rounded-xl hover:bg-yellow-200 border border-yellow-300 transition shadow-sm hover:shadow">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteOrRestore(w)}
                  className={`p-2.5 rounded-xl border shadow-sm hover:shadow transition ${
                    w.status === "A"
                      ? "text-red-700 bg-red-100 hover:bg-red-200 border-red-300"
                      : "text-green-800 bg-green-100 hover:bg-green-200 border-green-300"
                  }`}
                >
                  {w.status === "A" ? <FaTrashAlt /> : <FaTrashRestore />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No se encontraron trabajadores.</p>
        )}
      </div>

      {showForm && <WorkerFullForm worker={selectedWorker} onClose={handleCloseForm} />}
    </div>
  );
}

// COMPONENTES AUXILIARES DE FILTRO
function FilterInput({ label, value, setValue, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-semibold">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FilterSelect({ label, value, setValue, options }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
      >
        {options.map((o, idx) => (
          <option key={idx} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
