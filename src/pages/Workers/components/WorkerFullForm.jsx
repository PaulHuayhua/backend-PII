import { useEffect, useState } from "react";
import api from "../../../shared/Api/Api";
import { FaTimes } from "react-icons/fa";

export default function WorkerFullForm({ worker, onClose }) {
  const [form, setForm] = useState({
    document_type: "",
    document_number: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    marital_status: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    department: "",
    work_start_date: "",
    education_level: "",
    profession: "",
    job_title: "",
    bank_name: "",
    account_type: "",
    account_number: "",
    pension_system: "",
    afp_name: "",
    onp_entry_date: "",
    is_area_boss: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (worker) {
      setForm({
        document_type: worker.document_type || "",
        document_number: worker.document_number || "",
        first_name: worker.first_name || "",
        last_name: worker.last_name || "",
        birth_date: worker.birth_date ? worker.birth_date.slice(0, 10) : "",
        marital_status: worker.marital_status || "",
        email: worker.email || "",
        phone: worker.phone || "",
        address: worker.address || "",
        province: worker.province || "",
        district: worker.district || "",
        department: worker.department || "",
        work_start_date: worker.work_start_date ? worker.work_start_date.slice(0, 10) : "",
        education_level: worker.education_level || "",
        profession: worker.profession || "",
        job_title: worker.job_title || "",
        bank_name: worker.bank_name || "",
        account_type: worker.account_type || "",
        account_number: worker.account_number || "",
        pension_system: worker.pension_system || "",
        afp_name: worker.afp_name || "",
        onp_entry_date: worker.onp_entry_date ? worker.onp_entry_date.slice(0, 10) : "",
        is_area_boss: worker.is_area_boss ? 1 : 0
      });
    }
  }, [worker]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "document_type", "document_number", "first_name", "last_name",
      "birth_date", "email", "phone", "address", "department", "province", "district",
      "work_start_date", "education_level", "profession", "job_title",
      "bank_name", "account_type", "account_number", "pension_system"
    ];

    for (let field of requiredFields) {
      if (!form[field]) {
        setError(`El campo "${field}" es obligatorio.`);
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Email inválido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      let response;
      if (worker) {
        response = await api.put(`/workers/${worker.identifier}`, form);
      } else {
        response = await api.post("/workers", form);
      }

      if (response?.data) {
        // Solo cerrar y pasar datos si guardó correctamente
        onClose(response.data);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error al guardar el trabajador.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Tipo de Documento", name: "document_type" },
    { label: "Número de Documento", name: "document_number" },
    { label: "Nombre", name: "first_name" },
    { label: "Apellido", name: "last_name" },
    { label: "Fecha de Nacimiento", name: "birth_date", type: "date" },
    { label: "Estado Civil", name: "marital_status" },
    { label: "Email", name: "email", type: "email" },
    { label: "Teléfono", name: "phone" },
    { label: "Dirección", name: "address" },
    { label: "Distrito", name: "district" },
    { label: "Provincia", name: "province" },
    { label: "Departamento", name: "department" },
    { label: "Fecha de Inicio", name: "work_start_date", type: "date" },
    { label: "Nivel de Educación", name: "education_level" },
    { label: "Profesión", name: "profession" },
    { label: "Cargo", name: "job_title" },
    { label: "Banco", name: "bank_name" },
    { label: "Tipo de Cuenta", name: "account_type" },
    { label: "Número de Cuenta", name: "account_number" },
    { label: "Sistema de Pensiones", name: "pension_system" },
    { label: "Nombre AFP", name: "afp_name" },
    { label: "Fecha Ingreso ONP", name: "onp_entry_date", type: "date" }
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose(null)} // <-- cambio aquí
      ></div>

      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] z-10">
        <button
          onClick={() => onClose(null)} // <-- cambio aquí
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">{worker ? "Editar Trabajador" : "Nuevo Trabajador"}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <InputField
              key={f.name}
              label={f.label}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              type={f.type || "text"}
            />
          ))}

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="is_area_boss" checked={form.is_area_boss === 1} onChange={handleChange} />
            <label className="text-gray-700 font-semibold">Es jefe de área</label>
          </div>

          <div className="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => onClose(null)} className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm bg-gray-50 w-full focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
