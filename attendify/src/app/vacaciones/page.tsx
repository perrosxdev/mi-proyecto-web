"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVacations } from "@/app/context/VacationContext";
import { useUser } from "@/app/context/UserContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "../components/Modal";

export default function Vacaciones() {
  const { addVacationRequest } = useVacations();
  const { currentUser } = useUser();
  const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [minDate, setMinDate] = useState<Date | undefined>();
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const vacationTypes = [
    { id: 1, name: "Vacaciones Legales", minDays: 15 },
    { id: 2, name: "Vacaciones por Contrato", minDays: 20 },
    { id: 3, name: "Permiso Especial", minDays: 0 },
    { id: 4, name: "Día Administrativo", minDays: 2 },
  ];

  useEffect(() => {
    const today = new Date();
    const selectedVacationType = vacationTypes.find((type) => type.name === selectedReason);
    if (selectedVacationType) {
      const minDateValue = new Date(today);
      minDateValue.setDate(today.getDate() + selectedVacationType.minDays);
      setMinDate(minDateValue);
    } else {
      setMinDate(today);
    }
  }, [selectedReason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDateRange[0] || !selectedDateRange[1]) {
      setError("Por favor, selecciona un rango de fechas válido.");
      return;
    }

    if (!selectedReason) {
      setError("Por favor, selecciona una razón.");
      return;
    }

    const selectedVacationType = vacationTypes.find((type) => type.name === selectedReason);
    if (!selectedVacationType) {
      setError("Tipo de vacaciones no válido.");
      return;
    }

    const today = new Date();
    const startDate = selectedDateRange[0];
    const diffInDays = Math.ceil((startDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < selectedVacationType.minDays) {
      setError(
        `La solicitud de "${selectedReason}" debe realizarse con al menos ${selectedVacationType.minDays} días de anticipación.`
      );
      return;
    }

    if (currentUser) {
      await addVacationRequest({
        employeeId: currentUser.id,
        startDate: selectedDateRange[0]!.toISOString().split("T")[0],
        endDate: selectedDateRange[1]!.toISOString().split("T")[0],
        reason: selectedReason,
      });

      alert("Solicitud de vacaciones enviada correctamente.");
      router.push("/home");
    } else {
      setError("No se pudo identificar al usuario actual.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Solicitud de Vacaciones</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <button
              type="button"
              className="w-full border rounded px-3 py-2 bg-blue-900 text-white"
              onClick={() => setIsDateRangeModalOpen(true)}
            >
              {selectedDateRange[0] && selectedDateRange[1]
                ? `Desde ${selectedDateRange[0].toLocaleDateString()} hasta ${selectedDateRange[1].toLocaleDateString()}`
                : "Seleccionar Rango de Fechas"}
            </button>
          </div>

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
              <option value="">Seleccionar razón</option>
              {vacationTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="px-4 py-2 rounded font-medium bg-blue-900 text-white hover:bg-blue-700"
          >
            Confirmar
          </button>
        </form>

        <div className="mt-4">
          <button
            className="px-4 py-2 rounded font-medium w-full bg-blue-900 text-white hover:bg-blue-700"
            onClick={() => router.push("/vacaciones/historial")}
          >
            Ver Historial de Vacaciones
          </button>
        </div>
      </main>

      <Modal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        title="Seleccionar Rango de Fechas"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Desde:</label>
            <Calendar
              onChange={(date) => setSelectedDateRange([date as Date, selectedDateRange[1]])}
              value={selectedDateRange[0]}
              minDate={minDate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasta:</label>
            <Calendar
              onChange={(date) => setSelectedDateRange([selectedDateRange[0], date as Date])}
              value={selectedDateRange[1]}
              minDate={selectedDateRange[0] || minDate}
            />
          </div>
          <button
            onClick={() => setIsDateRangeModalOpen(false)}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>
      </Modal>
    </div>
  );
}