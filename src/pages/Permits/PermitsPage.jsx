import { useState } from "react";
import PermitList from "./components/PermitList";
import PermitForm from "./components/PermitForm";
import PermitView from "./components/PermitView";

export default function PermitsPage() {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewPermit, setViewPermit] = useState(null);
  const [reload, setReload] = useState(0); // <--- estado para recargar lista

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Boleta de Permisos</h1>

      <PermitList
        onEdit={(permit) => { setSelectedPermit(permit); setShowForm(true); }}
        onView={(permit) => setViewPermit(permit)}
        onCreate={() => { setSelectedPermit(null); setShowForm(true); }}
        reload={reload} // <--- pasar reload
      />

      {showForm && (
        <PermitForm
          permit={selectedPermit}
          onClose={() => setShowForm(false)}
          onSaved={() => { 
            setReload(prev => prev + 1); // <--- fuerza recarga de listado
            setShowForm(false);
          }}
        />
      )}

      {viewPermit && (
        <PermitView
          permit={viewPermit}
          onClose={() => setViewPermit(null)}
        />
      )}
    </div>
  );
}
