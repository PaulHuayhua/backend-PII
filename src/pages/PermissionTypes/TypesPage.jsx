import { useState } from "react";
import TypeList from "./components/TypeList";
import TypeForm from "./components/TypeForm";

export default function TypesPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-0">

      <TypeList
        onEdit={(type) => { setSelectedType(type); setShowForm(true); }}
        onCreate={() => { setSelectedType(null); setShowForm(true); }}
      />

      {showForm && (
        <TypeForm
          permissionType={selectedType}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
