import { useState, useEffect } from "react";
import { Send, X, Plus, Trash } from "lucide-react";
import api from "../../../shared/Api/Api";

function WorkerFullForm({ worker: initialWorker = null, onClose }) {
  const isEditing = !!initialWorker?.identifier;

  const emptyWorker = {
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
    is_area_boss: 0, // 0/1
  };

  const [formWorker, setFormWorker] = useState(emptyWorker);
  const [dependents, setDependents] = useState([]);
  const [children, setChildren] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && initialWorker) {
      // Map backend names to form fields (they should match already)
      setFormWorker({
        document_type: initialWorker.document_type || "",
        document_number: initialWorker.document_number || "",
        first_name: initialWorker.first_name || "",
        last_name: initialWorker.last_name || "",
        birth_date: initialWorker.birth_date || "",
        marital_status: initialWorker.marital_status || "",
        email: initialWorker.email || "",
        phone: initialWorker.phone || "",
        address: initialWorker.address || "",
        province: initialWorker.province || "",
        district: initialWorker.district || "",
        department: initialWorker.department || "",
        work_start_date: initialWorker.work_start_date || "",
        education_level: initialWorker.education_level || "",
        profession: initialWorker.profession || "",
        job_title: initialWorker.job_title || "",
        bank_name: initialWorker.bank_name || "",
        account_type: initialWorker.account_type || "",
        account_number: initialWorker.account_number || "",
        pension_system: initialWorker.pension_system || "",
        afp_name: initial_worker_afp(initialWorker),
        onp_entry_date: initialWorker.onp_entry_date || "",
        is_area_boss: initialWorker.is_area_boss ? 1 : 0,
      });

      // if the backend includes dependents/children arrays on worker, load them
      if (initialWorker.dependents) {
        setDependents(
          initialWorker.dependents.map((d) => ({
            identifier: d.identifier,
            relationship_type: d.relationship_type || "",
            first_name: d.first_name || "",
            last_name: d.last_name || "",
            dni: d.dni || "",
            birth_date: d.birth_date || "",
          }))
        );
      }

      if (initialWorker.children) {
        setChildren(
          initialWorker.children.map((c) => ({
            identifier: c.identifier,
            first_name: c.first_name || "",
            last_name: c.last_name || "",
            dni: c.dni || "",
            age: c.age != null ? c.age : "",
          }))
        );
      }
    }
  }, [initialWorker, isEditing]);

  // helper in case afp key naming varied
  function initial_worker_afp(initialWorker) {
    return initialWorker.afp_name || initialWorker.afp || "";
  }

  const handleWorkerChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? (checked ? 1 : 0) : value;
    setFormWorker((prev) => ({ ...prev, [name]: v }));
  };

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    setDependents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [name]: value };
      return copy;
    });
  };

  const handleChildChange = (index, e) => {
    const { name, value } = e.target;
    setChildren((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [name]: value };
      return copy;
    });
  };

  const addDependent = () =>
    setDependents((prev) => [
      ...prev,
      { relationship_type: "", first_name: "", last_name: "", dni: "", birth_date: "" },
    ]);

  const removeDependent = (index) =>
    setDependents((prev) => prev.filter((_, i) => i !== index));

  const addChild = () =>
    setChildren((prev) => [...prev, { first_name: "", last_name: "", dni: "", age: "" }]);

  const removeChild = (index) => setChildren((prev) => prev.filter((_, i) => i !== index));

  // Basic validation
  const validate = () => {
    const errs = {};

    // Worker validations
    if (!formWorker.first_name || !formWorker.first_name.trim()) errs.first_name = "Nombre obligatorio";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formWorker.first_name)) errs.first_name = "Sólo letras en el nombre";

    if (!formWorker.last_name || !formWorker.last_name.trim()) errs.last_name = "Apellidos obligatorios";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formWorker.last_name)) errs.last_name = "Sólo letras en apellidos";

    if (!formWorker.birth_date) errs.birth_date = "Fecha de nacimiento obligatoria";

    if (!formWorker.marital_status) errs.marital_status = "Estado civil obligatorio";

    if (!formWorker.email) errs.email = "Correo obligatorio";
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(formWorker.email)) errs.email = "Correo inválido";

    if (!formWorker.phone) errs.phone = "Celular obligatorio";
    else if (!/^9\d{8}$/.test(formWorker.phone)) errs.phone = "Debe empezar con 9 y tener 9 dígitos";

    if (!formWorker.address) errs.address = "Dirección obligatoria";

    if (!formWorker.province) errs.province = "Provincia obligatoria";
    if (!formWorker.district) errs.district = "Distrito obligatorio";
    if (!formWorker.department) errs.department = "Departamento obligatorio";

    if (!formWorker.work_start_date) errs.work_start_date = "Fecha de inicio laboral obligatoria";
    if (!formWorker.education_level) errs.education_level = "Nivel educativo obligatorio";
    if (!formWorker.profession) errs.profession = "Profesión obligatoria";
    if (!formWorker.job_title) errs.job_title = "Cargo (job_title) obligatorio";

    if (!formWorker.document_type) errs.document_type = "Tipo de documento obligatorio";
    else if (!["DNI", "CE"].includes(formWorker.document_type.toUpperCase())) errs.document_type = "Debe ser DNI o CE";

    if (!formWorker.document_number) errs.document_number = "Número de documento obligatorio";
    else if (!/^\d+$/.test(formWorker.document_number)) errs.document_number = "Número de documento solo dígitos";
    else if (formWorker.document_type.toUpperCase() === "DNI" && formWorker.document_number.length !== 8)
      errs.document_number = "DNI debe tener 8 dígitos";
    else if (formWorker.document_type.toUpperCase() === "CE" && (formWorker.document_number.length < 8 || formWorker.document_number.length > 12))
      errs.document_number = "CE debe tener entre 8 y 12 caracteres";

    // Dependents validation
    dependents.forEach((d, i) => {
      if (!d.relationship_type || !d.relationship_type.trim()) errs[`dependent_${i}_relationship_type`] = "Parentesco obligatorio";
      if (!d.first_name || !d.first_name.trim()) errs[`dependent_${i}_first_name`] = "Nombre obligatorio";
      if (!d.last_name || !d.last_name.trim()) errs[`dependent_${i}_last_name`] = "Apellido obligatorio";
      if (!d.dni || !/^\d{8}$/.test(d.dni)) errs[`dependent_${i}_dni`] = "DNI del dependiente (8 dígitos)";
      if (!d.birth_date) errs[`dependent_${i}_birth_date`] = "Fecha nacimiento obligatoria";
    });

    // Children validation
    children.forEach((c, i) => {
      if (!c.first_name || !c.first_name.trim()) errs[`child_${i}_first_name`] = "Nombre obligatorio";
      if (!c.last_name || !c.last_name.trim()) errs[`child_${i}_last_name`] = "Apellido obligatorio";
      if (!c.dni || !/^\d{8}$/.test(c.dni)) errs[`child_${i}_dni`] = "DNI del hijo (8 dígitos)";
      if (c.age === "" || c.age === null) errs[`child_${i}_age`] = "Edad obligatoria";
      else if (!Number.isInteger(Number(c.age)) || Number(c.age) < 0) errs[`child_${i}_age`] = "Edad inválida";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save flow (B): worker first, then dependents, then children
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // Prepare worker payload — ensure field names match backend
      const payloadWorker = {
        document_type: formWorker.document_type,
        document_number: formWorker.document_number,
        first_name: formWorker.first_name,
        last_name: formWorker.last_name,
        birth_date: formWorker.birth_date || null,
        marital_status: formWorker.marital_status,
        email: formWorker.email,
        phone: formWorker.phone,
        address: formWorker.address,
        province: formWorker.province,
        district: formWorker.district,
        department: formWorker.department,
        work_start_date: formWorker.work_start_date || null,
        education_level: formWorker.education_level,
        profession: formWorker.profession,
        job_title: formWorker.job_title,
        bank_name: formWorker.bank_name,
        account_type: formWorker.account_type,
        account_number: formWorker.account_number,
        pension_system: formWorker.pension_system,
        afp_name: formWorker.afp_name,
        onp_entry_date: formWorker.onp_entry_date || null,
        is_area_boss: Number(formWorker.is_area_boss) || 0,
      };

      let workerId;

      if (isEditing) {
        // Update existing worker
        await api.put(`/workers/update/${initialWorker.identifier}`, payloadWorker);
        workerId = initialWorker.identifier;
      } else {
        const res = await api.post("/workers/save", payloadWorker);
        // adjust this line if your API returns the created worker differently
        workerId = res?.data?.identifier || res?.data?.id || res?.data?.worker?.identifier;
      }

      if (!workerId) throw new Error("No se recibió identifier del worker desde el backend.");

      // Save dependents (each)
      for (const d of dependents) {
        const depPayload = {
          relationship_type: d.relationship_type,
          first_name: d.first_name,
          last_name: d.last_name,
          dni: d.dni,
          birth_date: d.birth_date || null,
          workers_identifier: workerId,
        };

        if (d.identifier) {
          // update
          await api.put(`/dependents/update/${d.identifier}`, depPayload);
        } else {
          await api.post("/dependents/save", depPayload);
        }
      }

      // Save children (each)
      for (const c of children) {
        const childPayload = {
          first_name: c.first_name,
          last_name: c.last_name,
          dni: c.dni,
          age: Number(c.age),
          workers_identifier: workerId,
        };

        if (c.identifier) {
          await api.put(`/children/update/${c.identifier}`, childPayload);
        } else {
          await api.post("/children/save", childPayload);
        }
      }

      setSaving(false);
      onClose(true);
    } catch (err) {
      console.error("Error guardando datos:", err);
      setSaving(false);
      alert("Ocurrió un error guardando los datos. Revisa la consola.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 relative">
        <button onClick={() => onClose(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-1">{isEditing ? "Editar Trabajador" : "Registrar Trabajador"}</h2>
        <p className="text-sm text-gray-500 mb-6">Completa los datos y guarda. Primero se guarda el trabajador, luego dependientes y hijos.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* WORKER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Tipo Documento (DNI/CE)" name="document_type" value={formWorker.document_type} onChange={handleWorkerChange} error={errors.document_type} />
            <InputField label="Número Documento" name="document_number" value={formWorker.document_number} onChange={handleWorkerChange} error={errors.document_number} />

            <InputField label="Nombre" name="first_name" value={formWorker.first_name} onChange={handleWorkerChange} error={errors.first_name} />
            <InputField label="Apellidos" name="last_name" value={formWorker.last_name} onChange={handleWorkerChange} error={errors.last_name} />

            <InputField type="date" label="Fecha Nacimiento" name="birth_date" value={formWorker.birth_date} onChange={handleWorkerChange} error={errors.birth_date} />
            <InputField label="Estado Civil" name="marital_status" value={formWorker.marital_status} onChange={handleWorkerChange} error={errors.marital_status} />

            <InputField label="Correo" name="email" value={formWorker.email} onChange={handleWorkerChange} error={errors.email} />
            <InputField label="Celular" name="phone" value={formWorker.phone} onChange={handleWorkerChange} error={errors.phone} />

            <InputField label="Dirección" name="address" value={formWorker.address} onChange={handleWorkerChange} error={errors.address} />
            <InputField label="Provincia" name="province" value={formWorker.province} onChange={handleWorkerChange} error={errors.province} />

            <InputField label="Distrito" name="district" value={formWorker.district} onChange={handleWorkerChange} error={errors.district} />
            <InputField label="Departamento" name="department" value={formWorker.department} onChange={handleWorkerChange} error={errors.department} />

            <InputField type="date" label="Fecha Inicio Laboral" name="work_start_date" value={formWorker.work_start_date} onChange={handleWorkerChange} error={errors.work_start_date} />
            <InputField label="Nivel Educativo" name="education_level" value={formWorker.education_level} onChange={handleWorkerChange} error={errors.education_level} />

            <InputField label="Profesión" name="profession" value={formWorker.profession} onChange={handleWorkerChange} error={errors.profession} />
            <InputField label="Cargo (job_title)" name="job_title" value={formWorker.job_title} onChange={handleWorkerChange} error={errors.job_title} />

            <InputField label="Banco" name="bank_name" value={formWorker.bank_name} onChange={handleWorkerChange} error={errors.bank_name} />
            <InputField label="Tipo de cuenta" name="account_type" value={formWorker.account_type} onChange={handleWorkerChange} error={errors.account_type} />

            <InputField label="Número de cuenta" name="account_number" value={formWorker.account_number} onChange={handleWorkerChange} error={errors.account_number} />
            <InputField label="Sistema de pensión (ONP/AFP)" name="pension_system" value={formWorker.pension_system} onChange={handleWorkerChange} error={errors.pension_system} />

            <InputField label="Nombre AFP" name="afp_name" value={formWorker.afp_name} onChange={handleWorkerChange} error={errors.afp_name} />
            <InputField type="date" label="Fecha ingreso ONP" name="onp_entry_date" value={formWorker.onp_entry_date} onChange={handleWorkerChange} error={errors.onp_entry_date} />

            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" name="is_area_boss" checked={!!formWorker.is_area_boss} onChange={handleWorkerChange} className="h-4 w-4" />
              <label className="text-sm">Es jefe de área</label>
            </div>
          </div>

          {/* DEPENDENTS */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Dependientes</h3>
              <button type="button" onClick={addDependent} className="flex items-center gap-2 text-sm text-blue-700">
                <Plus size={16} /> Agregar
              </button>
            </div>

            {dependents.length === 0 && <p className="text-sm text-gray-500">No hay dependientes agregados.</p>}

            {dependents.map((d, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <div>
                  <label className="block text-xs">Parentesco</label>
                  <input name="relationship_type" value={d.relationship_type} onChange={(e) => handleDependentChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`dependent_${i}_relationship_type`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`dependent_${i}_relationship_type`] && <p className="text-red-500 text-xs">{errors[`dependent_${i}_relationship_type`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">Nombre</label>
                  <input name="first_name" value={d.first_name} onChange={(e) => handleDependentChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`dependent_${i}_first_name`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`dependent_${i}_first_name`] && <p className="text-red-500 text-xs">{errors[`dependent_${i}_first_name`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">Apellidos</label>
                  <input name="last_name" value={d.last_name} onChange={(e) => handleDependentChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`dependent_${i}_last_name`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`dependent_${i}_last_name`] && <p className="text-red-500 text-xs">{errors[`dependent_${i}_last_name`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">DNI</label>
                  <input name="dni" value={d.dni} onChange={(e) => handleDependentChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`dependent_${i}_dni`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`dependent_${i}_dni`] && <p className="text-red-500 text-xs">{errors[`dependent_${i}_dni`]}</p>}
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-xs">Fecha Nac.</label>
                    <input type="date" name="birth_date" value={d.birth_date} onChange={(e) => handleDependentChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`dependent_${i}_birth_date`] ? "border-red-500" : "border-gray-300"}`} />
                    {errors[`dependent_${i}_birth_date`] && <p className="text-red-500 text-xs">{errors[`dependent_${i}_birth_date`]}</p>}
                  </div>

                  <button type="button" onClick={() => removeDependent(i)} className="text-red-600 p-2">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CHILDREN */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Hijos</h3>
              <button type="button" onClick={addChild} className="flex items-center gap-2 text-sm text-blue-700">
                <Plus size={16} /> Agregar
              </button>
            </div>

            {children.length === 0 && <p className="text-sm text-gray-500">No hay hijos agregados.</p>}

            {children.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <div>
                  <label className="block text-xs">Nombre</label>
                  <input name="first_name" value={c.first_name} onChange={(e) => handleChildChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`child_${i}_first_name`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`child_${i}_first_name`] && <p className="text-red-500 text-xs">{errors[`child_${i}_first_name`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">Apellidos</label>
                  <input name="last_name" value={c.last_name} onChange={(e) => handleChildChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`child_${i}_last_name`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`child_${i}_last_name`] && <p className="text-red-500 text-xs">{errors[`child_${i}_last_name`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">DNI</label>
                  <input name="dni" value={c.dni} onChange={(e) => handleChildChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`child_${i}_dni`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`child_${i}_dni`] && <p className="text-red-500 text-xs">{errors[`child_${i}_dni`]}</p>}
                </div>

                <div>
                  <label className="block text-xs">Edad</label>
                  <input name="age" type="number" min="0" value={c.age} onChange={(e) => handleChildChange(i, e)} className={`w-full border rounded px-2 py-1 ${errors[`child_${i}_age`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`child_${i}_age`] && <p className="text-red-500 text-xs">{errors[`child_${i}_age`]}</p>}
                </div>

                <div className="flex items-center">
                  <button type="button" onClick={() => removeChild(i)} className="text-red-600 p-2">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => onClose(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>

            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
              {saving ? "Guardando..." : (<><Send size={16} /> {isEditing ? "Actualizar" : "Registrar"}</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkerFullForm;

/* Reusable InputField component */
function InputField({ label, name, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded px-3 py-2 focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
