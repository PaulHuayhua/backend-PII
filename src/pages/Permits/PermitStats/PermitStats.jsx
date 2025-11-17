import { useEffect, useState } from "react";
import api from "../../../shared/Api/Api";

function PermitStats() {
    const [stats, setStats] = useState({
        Aprobadas: 0,
        Pendiente: 0,
        Proceso: 0,
    });

    const fetchPermitStats = async () => {
        try {
            const response = await api.get("/permit_tickets/");
            const data = response.data;

            // Contamos por estado
            const counts = { Aprobadas: 0, Pendiente: 0, Proceso: 0 };

            data.forEach((ticket) => {
                let estado = "";

                if (ticket.ticket_status?.state) {
                    estado = ticket.ticket_status.state.toLowerCase();
                } else {

                    if (ticket.ticket_status_identifier === 1) estado = "Pendiente";
                    else if (ticket.ticket_status_identifier === 2) estado = "Proceso";
                    else if (ticket.ticket_status_identifier === 3) estado = "Aprobada";
                }

                if (estado.includes("Aprobada")) counts.Aprobadas++;
                else if (estado.includes("Pendiente")) counts.Pendiente++;
                else if (estado.includes("Proceso")) counts.Proceso++;
            });

            setStats(counts);
        } catch (error) {
            console.error("Error al obtener estadísticas de permisos:", error);
        }
    };

    useEffect(() => {
        fetchPermitStats();
    }, []);

    return (
        <div className="border rounded-lg p-6 bg-gray-50 mb-8 m-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Gestión de boletas de permiso
            </h2>
            <p className="text-gray-500 mb-5">
                Sistema de gestión de permisos. Aquí puedes gestionar todas tus
                solicitudes de manera eficiente.
            </p>

            <div className="flex flex-wrap gap-4">

                <div className="flex-1 min-w-[180px] bg-blue-950 text-white rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-semibold text-yellow-400">Aprobadas</h3>
                    <p className="text-3xl font-bold mt-1">{stats.Aprobadas}</p>
                </div>

                <div className="flex-1 min-w-[180px] bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Pendientes</h3>
                    <p className="text-3xl font-bold mt-1 text-black">
                        {stats.Pendiente}
                    </p>
                </div>

                <div className="flex-1 min-w-[180px] bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">En Proceso</h3>
                    <p className="text-3xl font-bold mt-1 text-black">
                        {stats.Proceso}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PermitStats