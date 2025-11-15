// src/components/Layout/Sidebar.jsx
import { Users, ClipboardList, Tags } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#0D1B2A] text-white p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex flex-col gap-1 mb-10 bg-[#12263B] p-4 rounded-2xl shadow-inner">
          <p className="font-semibold text-lg truncate">Administrador</p>
          <p className="text-sm text-gray-300 truncate">admin@vallegrande.edu.pe</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link
            to="/workers"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900 transition"
          >
            <Users className="w-5 h-5" /> Trabajadores
          </Link>

          <Link
            to="/types"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900 transition"
          >
            <Tags className="w-5 h-5" /> Tipos de Permisos
          </Link>

          <Link
            to="/permits"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900 transition"
          >
            <ClipboardList className="w-5 h-5" /> Boletas de Permiso
          </Link>
        </nav>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          to="/permits"
          className="w-28 h-32 flex flex-col items-center justify-center bg-[#0F2A44] rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm text-center">Nueva Boleta</span>
        </Link>

        <Link
          to="/workers"
          className="w-28 h-32 flex flex-col items-center justify-center bg-[#0F2A44] rounded-xl hover:bg-green-700 transition shadow-md"
        >
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm text-center">Nuevo Trabajador</span>
        </Link>
      </div>
    </aside>
  );
}
