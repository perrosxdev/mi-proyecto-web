"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useEmployees } from "@/app/context/EmployeeContext";
import { useWorkHours } from "@/app/context/WorkHoursContext";

export default function Registro() {
  const { currentUser } = useUser(); // Obtener el usuario actual
  const { getAttendanceHistory, addAttendance } = useEmployees();
  const { intervals, tolerance } = useWorkHours(); // Obtener los horarios laborales y la tolerancia
  const [entryTime, setEntryTime] = useState<string | null>(null); // Hora de entrada
  const [exitTime, setExitTime] = useState<string | null>(null); // Hora de salida

  // Cargar los registros de entrada y salida al montar el componente
  useEffect(() => {
    if (!currentUser) return;

    const attendanceHistory = getAttendanceHistory(currentUser.id);
    const today = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato YYYY-MM-DD

    // Buscar la hora de entrada
    const entry = attendanceHistory.find(
      (record) => record.date === today && record.type === "entrada"
    );
    if (entry) setEntryTime(entry.time);

    // Buscar la hora de salida
    const exit = attendanceHistory.find(
      (record) => record.date === today && record.type === "salida"
    );
    if (exit) setExitTime(exit.time);
  }, [currentUser, getAttendanceHistory]);

  const handleRegisterAttendance = (type: "entrada" | "salida") => {
    if (!currentUser) {
      alert("No se ha detectado un usuario autenticado.");
      return;
    }

    const now = new Date();
    const record = {
      date: now.toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
      time: now.toTimeString().split(" ")[0], // Hora en formato HH:mm:ss
      type,
    };

    addAttendance(currentUser.id, record); // Registrar la asistencia del usuario actual

    // Actualizar los tiempos de entrada o salida
    if (type === "entrada") {
      setEntryTime(record.time);
    } else if (type === "salida") {
      setExitTime(record.time);
    }
  };

  const isWithinWorkHours = (time: string) => {
    const [currentHour, currentMinute] = time.split(":").map(Number);
    const currentTime = currentHour * 60 + currentMinute;

    return intervals.some(({ start, end }) => {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      return currentTime >= startTime && currentTime <= endTime + tolerance;
    });
  };

  const getWorkStatus = () => {
    if (entryTime && !exitTime) {
      return isWithinWorkHours(entryTime) ? "Trabajando (Dentro del horario)" : "Trabajando (Fuera del horario)";
    } else if (entryTime && exitTime) {
      return "Fuera de horario";
    } else {
      return "Sin actividad registrada";
    }
  };

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
            Usuario: <strong>{currentUser?.name}</strong>
          </p>

          {/* Mostrar los horarios laborales */}
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-bold mb-2 text-blue-900">Horario Laboral</h2>
            <ul className="list-disc pl-6">
              {intervals.map((interval, index) => (
                <li key={index} className="text-blue-900">
                  {interval.start} - {interval.end}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Tolerancia: <strong>{tolerance} minutos</strong>
            </p>
          </div>

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
            <p className="text-blue-900 font-medium">
              Estado: <strong>{getWorkStatus()}</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}