import { Search, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-6 z-50">

      {/* Bloque izquierdo: Avatar + Títulos */}
      <div className="flex items-center gap-4">

        {/* Avatar VG */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow">
          VG
        </div>

        {/* Textos */}
        <div className="flex flex-col leading-tight">
          <h1 className="text-lg font-semibold tracking-wide">
            Área de Boletas de Permiso
          </h1>
          <span className="text-sm text-gray-500">
            Instituto Valle Grande
          </span>
        </div>
      </div>

      {/* Bloque derecho */}
      <div className="flex items-center gap-5">

        {/* Buscador minimalista */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-80 border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Iconos con hover */}
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition" />
        <User className="w-7 h-7 text-gray-600 cursor-pointer hover:text-blue-600 transition" />
      </div>

    </header>
  );
}
