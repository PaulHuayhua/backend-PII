import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import api from "../../../shared/Api/Api";

export default function WorkerChildrenForm({ worker, children: initialChildren = [], onClose }) {
  const [children, setChildren] = useState(initialChildren);

  const addChild = () => setChildren([...children, { first_name: "", last_name: "", dni: "", age: "" }]);
  const removeChild = (index) => setChildren(children.filter((_, i) => i !== index));

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setChildren(prev => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const c of children) {
        const payload = { ...c, workers_identifier: worker.identifier };
        if (c.identifier) await api.put(`/children/update/${c.identifier}`, payload);
        else await api.post("/children/save", payload);
      }
      onClose(children);
    } catch (err) {
      console.error(err);
      alert("Error guardando hijos");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Hijos de {worker.first_name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children.map((c, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <input name="first_name" placeholder="Nombre" value={c.first_name} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input name="last_name" placeholder="Apellido" value={c.last_name} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input name="dni" placeholder="DNI" value={c.dni} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <input type="number" min="0" name="age" placeholder="Edad" value={c.age} onChange={e => handleChange(i, e)} className="border rounded px-2 py-1" />
            <button type="button" onClick={() => removeChild(i)} className="text-red-600 p-2"><Trash size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={addChild} className="flex items-center gap-2 text-blue-700">
          <Plus size={16} /> Agregar Hijo
        </button>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Guardar Hijos</button>
        </div>
      </form>
    </div>
  );
}
