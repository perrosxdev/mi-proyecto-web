"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos de react-datepicker

export default function Vacaciones() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [minDate, setMinDate] = useState<Date | undefined>();

  // Calcula la fecha mínima (15 días después de hoy)
  useEffect(() => {
    const today = new Date();
    const minDateValue = new Date(today);
    minDateValue.setDate(today.getDate() + 15); // Suma 15 días a la fecha actual
    setMinDate(minDateValue);
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-900">
          Solicitud de Vacaciones
        </h2>
        <form className="flex flex-col gap-4">
          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium mb-1">
              Fecha:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)} // Actualiza la fecha seleccionada
              minDate={minDate} // Deshabilita fechas antes de la mínima
              dateFormat="dd/MM/yyyy"
              className="w-full border rounded px-3 py-2 text-left bg-white"
              placeholderText="Seleccionar fecha"
            />
          </div>

          {/* Razón */}
          <div>
            <label htmlFor="razon" className="block text-sm font-medium mb-1">
              Razón:
            </label>
            <textarea
              id="razon"
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="Escribe la razón de tu solicitud..."
            />
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
    </div>
  );
}