"use client";

import { useUser } from "@/app/context/UserContext";
import { useEmployees } from "@/app/context/EmployeeContext";

export default function Registro() {
  const { currentUser } = useUser(); // Obtener el usuario actual
  const { addAttendance } = useEmployees();

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
    alert(`Asistencia de tipo "${type}" registrada correctamente.`);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-4xl mt-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Registro de Asistencia
        </h1>
        <div className="flex flex-col gap-4">
          <p className="text-lg">
            Usuario: <strong>{currentUser?.name}</strong>
          </p>
          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-500"
              onClick={() => handleRegisterAttendance("entrada")}
            >
              Registrar Entrada
            </button>
            <button
              className="bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-500"
              onClick={() => handleRegisterAttendance("salida")}
            >
              Registrar Salida
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}