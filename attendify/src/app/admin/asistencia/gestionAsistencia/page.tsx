"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AttendanceRecord, Employee } from "@/app/context/EmployeeContext";
import Modal from "@/app/components/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function GestionAsistencia() {
  const [employees, setEmployees] = useState<Employee[]>([]); // Lista de empleados
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null); // Empleado seleccionado
  const [newRecord, setNewRecord] = useState<AttendanceRecord>({
    employee_id: 0, // Valor predeterminado para employee_id
    date: "",
    time: "",
    type: "entrada",
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false); // Estado para el modal de fecha
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false); // Estado para el modal de hora
  const [selectedHour, setSelectedHour] = useState("12"); // Hora seleccionada
  const [selectedMinute, setSelectedMinute] = useState("00"); // Minuto seleccionado
  const [error, setError] = useState("");

  // **Nuevo estado para el modal de notificaciones**
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState(""); // Título dinámico del modal
  const [notificationMessage, setNotificationMessage] = useState(""); // Mensaje del modal

  // Cargar empleados desde Supabase (excluyendo al administrador)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Paso 1: Obtener los employee_id de los administradores
        const { data: adminUsers, error: adminError } = await supabase
          .from("users")
          .select("employee_id")
          .eq("role", "admin");

        if (adminError) {
          console.error("Error fetching admin users:", adminError);
          return;
        }

        // Extraer los IDs de los administradores
        const adminEmployeeIds = adminUsers.map((user) => user.employee_id);

        // Paso 2: Obtener los empleados excluyendo a los administradores
        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select(`
            id, 
            name, 
            position,
            attendance: attendance (employee_id, date, time, type) -- Incluir la relación attendance
          `)
          .not("id", "in", `(${adminEmployeeIds.join(",")})`); // Excluir los IDs de los administradores

        if (employeesError) {
          console.error("Error fetching employees:", employeesError);
          return;
        }

        // Mapear los empleados para incluir un valor predeterminado para attendance
        const mappedEmployees = (employeesData || []).map((employee: any) => ({
          ...employee,
          attendance: employee.attendance || [], // Valor predeterminado
        }));

        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Unexpected error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Agregar o corregir un registro de asistencia
  const handleAddRecord = async () => {
    if (!selectedEmployeeId || !newRecord.date || !newRecord.time) {
      setError("Por favor, completa todos los campos.");
      return;
    }
  
    const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  
    const { error } = await supabase.from("attendance").insert({
      employee_id: selectedEmployeeId,
      date: newRecord.date,
      time: newRecord.time,
      type: newRecord.type,
    });
  
    if (error) {
      console.error("Error adding attendance record:", error);
      setNotificationTitle("Error");
      setNotificationMessage("Ocurrió un error al agregar el registro.");
      setIsNotificationModalOpen(true); // Abrir el modal de notificación
    } else {
      setNotificationTitle(
        newRecord.type === "entrada" ? "Entrada agregada" : "Salida agregada"
      );
      setNotificationMessage(
        `Se agregó una ${newRecord.type} para ${selectedEmployee?.name || "el empleado"} el ${newRecord.date} a las ${newRecord.time}.`
      );
      setIsNotificationModalOpen(true); // Abrir el modal de notificación
  
      // Restablecer el formulario excepto el empleado seleccionado
      setNewRecord({
        employee_id: selectedEmployeeId, // Mantener el empleado seleccionado
        date: "", // Restablecer la fecha
        time: "", // Restablecer la hora
        type: "entrada", // Restablecer el tipo a "entrada"
      });
  
      setError(""); // Limpiar errores
    }
  };

  // Guardar la hora seleccionada
  const handleSaveTime = () => {
    setNewRecord({ ...newRecord, time: `${selectedHour}:${selectedMinute}` });
    setIsTimeModalOpen(false);
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <main className="bg-card rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
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
                className="w-full border rounded px-3 py-2 bg-blue-800 text-white"
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
                className="w-full border rounded px-3 py-2 bg-blue-800 text-white"
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
                className="w-full border rounded px-3 py-2 text-center"
                value={newRecord.type}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, type: e.target.value as "entrada" | "salida" })
                }
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-900 text-white"
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

        {/* Modal de notificaciones */}
        <Modal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          title={notificationTitle} // Título dinámico
        >
          <p>{notificationMessage}</p>
        </Modal>
      </main>
    </div>
  );
}