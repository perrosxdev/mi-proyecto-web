"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

export default function Registro() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);
    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-6">Registro de Asistencia</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Fecha */}
          <div className="relative">
            <label htmlFor="fecha" className="block text-sm font-medium mb-1">
              Fecha:
            </label>
            <input
              type="date"
              id="fecha"
              className="w-full border rounded px-3 py-2"
              value={currentDate}
              readOnly
            />
            <span
              onClick={() => document.getElementById("fecha")?.focus()}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              <span className="material-icons">calendar_today</span>
            </span>
          </div>

          {/* Hora */}
          <div className="relative">
            <label htmlFor="hora" className="block text-sm font-medium mb-1">
              Hora:
            </label>
            <input
              type="time"
              id="hora"
              className="w-full border rounded px-3 py-2"
              value={currentTime}
              readOnly
            />
            <span
              onClick={() => document.getElementById("hora")?.focus()}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              <span className="material-icons">access_time</span>
            </span>
          </div>

          {/* Tipo de Registro */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium mb-1">
              Tipo de Registro:
            </label>
            <select
              id="tipo"
              className="w-full border rounded px-3 py-2"
              defaultValue="Entrada"
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>

          {/* Botón Confirmar */}
          <button
            type="submit"
            className="bg-blue-900 text-white font-medium py-2 rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </form>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registro Exitoso"
      >
        <p>El registro de asistencia se ha enviado correctamente.</p>
      </Modal>
    </div>
  );
}