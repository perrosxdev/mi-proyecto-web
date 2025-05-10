"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useEmployees } from "@/app/context/EmployeeContext";
import { AttendanceRecord } from "@/app/context/EmployeeContext"; // Importar el tipo
import { useRouter } from "next/navigation";

export default function Registro() {
  const { currentUser } = useUser(); // Obtener el usuario actual
  const { getAttendanceHistory, addAttendance } = useEmployees();
  const router = useRouter();

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]); // Especificar el tipo
  const [entryTime, setEntryTime] = useState<string | null>(null); // Hora de entrada
  const [exitTime, setExitTime] = useState<string | null>(null); // Hora de salida
  const [message, setMessage] = useState<string | null>(null); // Mensaje de retroalimentación
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar datos del usuario y el historial de asistencia
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        router.push("/"); // Redirigir al login si no hay usuario autenticado
        return;
      }

      try {
        // Obtener el historial de asistencia del usuario actual
        const history = getAttendanceHistory(currentUser.id) || [];
        setAttendanceHistory(history); // Ahora funciona correctamente

        const today = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato YYYY-MM-DD

        // Buscar la hora de entrada
        const entry = history.find(
          (record) => record.date === today && record.type === "entrada"
        );
        if (entry) setEntryTime(entry.time);

        // Buscar la hora de salida
        const exit = history.find(
          (record) => record.date === today && record.type === "salida"
        );
        if (exit) setExitTime(exit.time);
      } catch (error) {
        console.error("Error al cargar el historial de asistencia:", error);
        setMessage("Ocurrió un error al cargar el historial de asistencia.");
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchData();
  }, [currentUser, getAttendanceHistory, router]);

  const handleRegisterAttendance = async (type: "entrada" | "salida") => {
    if (!currentUser) {
      setMessage("No se ha detectado un usuario autenticado.");
      return;
    }

    const now = new Date();
    const record = {
      date: now.toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
      time: now.toTimeString().split(" ")[0], // Hora en formato HH:mm:ss
      type,
    };

    try {
      await addAttendance(currentUser.id, record); // Registrar la asistencia del usuario actual

      // Actualizar los tiempos de entrada o salida
      if (type === "entrada") {
        setEntryTime(record.time);
        setMessage("Entrada registrada correctamente.");
      } else if (type === "salida") {
        setExitTime(record.time);
        setMessage("Salida registrada correctamente.");
      }
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      setMessage("Ocurrió un error al registrar la asistencia. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>; // Mostrar un mensaje mientras se cargan los datos
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main
        className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-4xl mt-8"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "var(--primary)" }}
        >
          Registro de Asistencia
        </h1>
        <div className="flex flex-col gap-4">
          <p className="text-lg">
            Usuario: <strong>{currentUser?.name || "No autenticado"}</strong>
          </p>

          <div className="flex gap-4">
            {/* Botón para registrar entrada */}
            <button
              className="py-2 px-4 rounded font-medium"
              style={{
                backgroundColor: entryTime ? "#D3D3D3" : "#1C398E",
                color: entryTime ? "#A9A9A9" : "#FFFFFF",
                cursor: entryTime ? "not-allowed" : "pointer",
              }}
              onClick={() => handleRegisterAttendance("entrada")}
              disabled={!!entryTime} // Deshabilitar si ya registró la entrada
            >
              {entryTime ? "Entrada Registrada" : "Registrar Entrada"}
            </button>

            {/* Botón para registrar salida */}
            <button
              className="py-2 px-4 rounded font-medium"
              style={{
                backgroundColor: !entryTime || exitTime ? "#D3D3D3" : "#1C398E",
                color: !entryTime || exitTime ? "#A9A9A9" : "#FFFFFF",
                cursor: !entryTime || exitTime ? "not-allowed" : "pointer",
              }}
              onClick={() => handleRegisterAttendance("salida")}
              disabled={!entryTime || !!exitTime} // Deshabilitar si no registró entrada o ya registró salida
            >
              {exitTime
                ? "Salida Registrada"
                : entryTime
                ? "Registrar Salida"
                : "Registrar Entrada Primero"}
            </button>
          </div>

          {/* Mostrar los registros y el estado del usuario */}
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <p className="text-blue-900 font-medium">
              Hora de Entrada: <strong>{entryTime || "No registrada"}</strong>
            </p>
            <p className="text-blue-900 font-medium">
              Hora de Salida: <strong>{exitTime || "No registrada"}</strong>
            </p>
          </div>

          {/* Mostrar el historial de asistencia */}
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2 text-blue-900">Historial de Asistencia</h2>
            <ul className="list-disc pl-6">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((record, index) => (
                  <li key={index} className="text-blue-900">
                    {record.date} - {record.time} ({record.type})
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No hay registros de asistencia disponibles.</p>
              )}
            </ul>
          </div>

          {/* Mensaje de retroalimentación */}
          {message && <p className="text-green-600 font-medium">{message}</p>}
        </div>
      </main>
    </div>
  );
}