import { X, User2, Briefcase, CalendarCheck, Clock, FileText, ImageIcon, Download } from "lucide-react";

export default function PermitView({ permit, onClose }) {
  if (!permit) return null;

  const horario = permit.start_time && permit.end_time 
    ? `${permit.start_time} - ${permit.end_time}` 
    : "Todo el día";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={22} /></button>

        <h2 className="text-2xl font-semibold mb-4">Detalle del Permiso</h2>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><User2 size={18}/> Trabajador</h3>
            <p>{permit.worker?.first_name} {permit.worker?.last_name}</p>
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Briefcase size={18}/> Área</h3>
            <p>{permit.worker?.job_title}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><CalendarCheck size={18}/> Fecha</h3>
            <p>{permit.application_date}</p>
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Clock size={18}/> Horario</h3>
            <p>{horario}</p>
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2"><FileText size={18}/> Motivo</h3>
            <p>{permit.reason}</p>
          </div>
        </div>

        {permit.evidence_document && (
          <div className="mb-4">
            <h3 className="font-semibold flex items-center gap-2"><ImageIcon size={18}/> Evidencia</h3>
            <a href={`http://127.0.0.1:5000/uploads/${permit.evidence_document}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">{permit.evidence_document}</a>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition font-medium">
            Cerrar
          </button>
          <button className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition">
            <Download size={18}/> Guardar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
