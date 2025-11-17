import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import api from "../../../shared/Api/Api";

export default function WorkerDependentsForm({ worker, dependents: initialDependents = [], onClose }) {
  const [dependents, setDependents] = useState(initialDependents);

  const addDependent = () => {
    setDependents([...dependents, { relationship_type: "", first_name: "", last_name: "", dni: "", birth_date: "" }]);
  };

  const removeDependent = (index) => {
    setDependents(dependents.filter((_, i) => i !== index));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setDependents(prev => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Guardar dependientes en backend
      for (const d of dependents) {
        const payload = { ...d, workers_identifier: worker.identifier };
        if (d.identifier) {
          await api.put(`/dependents/update/${d.identifier}`, payload);
        } else {
          await api.post("/dependents/save", payload);
        }
      }
      onClose(dependents);
    } catch (err) {
      console.error(err);
      alert("Error guardando dependientes");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Dependientes de {worker.first_name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {dependents.map((d, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <input name="relationship_type" placeholder="Parentesco" value={d.relationship_type} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input name="first_name" placeholder="Nombre" value={d.first_name} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input name="last_name" placeholder="Apellido" value={d.last_name} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input name="dni" placeholder="DNI" value={d.dni} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input type="date" name="birth_date" value={d.birth_date} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <button type="button" onClick={() => removeDependent(i)} className="text-red-600 p-2"><Trash size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={addDependent} className="flex items-center gap-2 text-blue-700">
          <Plus size={16} /> Agregar Dependiente
        </button>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Guardar Dependientes</button>
        </div>
      </form>
    </div>
  );
}
