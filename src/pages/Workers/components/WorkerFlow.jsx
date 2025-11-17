import { useState } from "react";
import WorkerFullForm from "./WorkerFullForm";
import WorkerDependentsForm from "./WorkerDependentsForm";
import WorkerChildrenForm from "./WorkerChildrenForm";
import WorkerList from "./WorkerList";

export default function WorkerFlow() {
  const [step, setStep] = useState(0);
  const [worker, setWorker] = useState(null);
  const [dependents, setDependents] = useState([]);
  const [children, setChildren] = useState([]);

const handleWorkerSaved = (savedWorker) => {
  if (!savedWorker) return;
  setWorker(savedWorker);

  const hasDependents = window.confirm("¿El trabajador tiene derechohabientes?");
  if (hasDependents) setStep(1);
  else {
    const hasChildren = window.confirm("¿El trabajador tiene hijos?");
    setStep(hasChildren ? 2 : 3); // Solo va al listado si no hay hijos
  }
};


  const handleDependentsSaved = (savedDependents) => {
    setDependents(savedDependents);
    const hasChildren = window.confirm("¿El trabajador tiene hijos?");
    setStep(hasChildren ? 2 : 3);
  };

  const handleChildrenSaved = (savedChildren) => {
    setChildren(savedChildren);
    setStep(3);
  };

  return (
    <div>
      {step === 0 && (
        <WorkerFullForm
          worker={worker}
          onClose={handleWorkerSaved}
        />
      )}

      {step === 1 && (
        <WorkerDependentsForm
          worker={worker}
          dependents={dependents}
          onClose={handleDependentsSaved}
        />
      )}

      {step === 2 && (
        <WorkerChildrenForm
          worker={worker}
          children={children}
          onClose={handleChildrenSaved}
        />
      )}

      {step === 3 && (
        <WorkerList
          worker={worker}
          dependents={dependents}
          children={children}
          onCreate={() => setStep(0)}
        />
      )}
    </div>
  );
}
