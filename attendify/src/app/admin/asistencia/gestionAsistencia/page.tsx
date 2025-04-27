"use client";

import { useState } from "react";
import { useEmployees } from "@/app/context/EmployeeContext";
import Modal from "@/app/components/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function GestionAsistencia() {
  const { employees, setEmployees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState({ date: "", time: "", type: "entrada" });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false); // Estado para el modal de fecha
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false); // Estado para el modal de hora
  const [selectedHour, setSelectedHour] = useState("12"); // Hora seleccionada
  const [selectedMinute, setSelectedMinute] = useState("00"); // Minuto seleccionado
  const [error, setError] = useState("");

  // Agregar o corregir un registro de asistencia
  const handleAddRecord = () => {
    if (!selectedEmployeeId || !newRecord.date || !newRecord.time) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === selectedEmployeeId
          ? {
              ...employee,
              attendance: [...employee.attendance, newRecord],
            }
          : employee
      )
    );

    setNewRecord({ date: "", time: "", type: "entrada" });
    setError("");
    alert("Registro de asistencia agregado correctamente.");
  };

  // Guardar la hora seleccionada
  const handleSaveTime = () => {
    setNewRecord({ ...newRecord, time: `${selectedHour}:${selectedMinute}` });
    setIsTimeModalOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 sm:p-8"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <main
        className="rounded-lg shadow-md p-6 w-full max-w-4xl mt-8"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "var(--primary)" }}
        >
          Gestión de Asistencia
        </h1>

        {/* Formulario para agregar o corregir registros */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Registrar Asistencia Manualmente</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddRecord();
            }}
          >
            <div>
              <label htmlFor="employee" className="block text-sm font-medium mb-1">
                Seleccionar Empleado:
              </label>
              <select
                id="employee"
                className="w-full border rounded px-3 py-2"
                value={selectedEmployeeId || ""}
                onChange={(e) => setSelectedEmployeeId(Number(e.target.value) || null)}
              >
                <option value="">Seleccionar</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Fecha:
              </label>
              <button
                type="button"
                className="w-full border rounded px-3 py-2 bg-blue-900 text-white"
                onClick={() => setIsDateModalOpen(true)}
              >
                {newRecord.date ? newRecord.date : "Seleccionar Fecha"}
              </button>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">
                Hora:
              </label>
              <button
                type="button"
                className="w-full border rounded px-3 py-2 bg-blue-900 text-white"
                onClick={() => setIsTimeModalOpen(true)}
              >
                {newRecord.time ? newRecord.time : "Seleccionar Hora"}
              </button>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Tipo:
              </label>
              <select
                id="type"
                className="w-full border rounded px-3 py-2"
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Agregar Registro
            </button>
          </form>
        </div>

        {/* Modal para seleccionar la fecha */}
        <Modal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          title="Seleccionar Fecha"
        >
          <div className="flex flex-col gap-4">
            <Calendar
              onChange={(date) => {
                setNewRecord({
                  ...newRecord,
                  date: (date as Date).toISOString().split("T")[0], // Formato YYYY-MM-DD
                });
                setIsDateModalOpen(false); // Cerrar el modal
              }}
              value={newRecord.date ? new Date(newRecord.date) : new Date()}
            />
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </Modal>

        {/* Modal para seleccionar la hora */}
        <Modal
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          title="Seleccionar Hora"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Hora:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(
                  (hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Minutos:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(
                  (minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  )
                )}
              </select>
            </div>
            <button
              onClick={handleSaveTime}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Hora
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}