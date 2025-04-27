"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Importa Link para la navegación
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../components/Modal";

export default function Vacaciones() {
  const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [minDate, setMinDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const minDateValue = new Date(today);
    minDateValue.setDate(today.getDate() + 15);
    setMinDate(minDateValue);
  }, []);

  const vacationTypes = [
    { id: 1, name: "Vacaciones Legales" },
    { id: 2, name: "Vacaciones por Contrato" },
    { id: 3, name: "Permiso Especial" },
    { id: 4, name: "Día Administrativo" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateRange[0] || !selectedDateRange[1]) {
      setError("Por favor, selecciona un rango de fechas válido.");
      return;
    }
    if (!selectedReason) {
      setError("Por favor, selecciona una razón.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-900">
          Solicitud de Vacaciones
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Rango de Fechas */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium mb-1">
              Rango de Fechas:
            </label>
            <DatePicker
              selectsRange
              startDate={selectedDateRange[0]}
              endDate={selectedDateRange[1]}
              onChange={(update) => setSelectedDateRange(update)}
              minDate={minDate}
              dateFormat="dd/MM/yyyy"
              className="w-full border rounded px-3 py-2 text-left bg-white"
              placeholderText="Seleccionar rango de fechas"
            />
          </div>

          {/* Razón */}
          <div>
            <label htmlFor="razon" className="block text-sm font-medium mb-1">
              Razón:
            </label>
            <select
              id="razon"
              className="w-full border rounded px-3 py-2"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              {vacationTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Validación de restricciones */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón Confirmar */}
          <button
            type="submit"
            className="bg-blue-900 text-white font-medium py-2 rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </form>

        {/* Botón para Historial de Vacaciones */}
        <div className="mt-4">
          <Link href="/vacaciones/historial">
            <button className="bg-blue-900 text-white font-medium py-2 rounded hover:bg-blue-700 w-full">
              Ver Historial de Vacaciones
            </button>
          </Link>
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Solicitud Enviada"
      >
        <p>Tu solicitud de vacaciones se ha enviado correctamente.</p>
      </Modal>
    </div>
  );
}