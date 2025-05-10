"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/lib/supabaseClient";
import { Employee } from "@/app/context/EmployeeContext"; // Importar la interfaz Employee

export default function AsistenciaEmpleados() {
  const [employees, setEmployees] = useState<Employee[]>([]); // Cambiar el tipo a Employee[]
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [recordType, setRecordType] = useState<string>(""); // Filtro por tipo de registro
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [filteredAttendanceHistory, setFilteredAttendanceHistory] = useState<any[]>([]); // Estado para los registros filtrados

  // Normalizar una fecha para ignorar la hora (establecerla a las 00:00:00)
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Cargar empleados y registros de asistencia desde Supabase
  useEffect(() => {
    const fetchEmployeesWithAttendance = async () => {
      try {
        // Obtener empleados
        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select("id, name, position");

        if (employeesError) {
          console.error("Error fetching employees:", employeesError);
          return;
        }

        // Obtener registros de asistencia
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("employee_id, date, time, type");

        if (attendanceError) {
          console.error("Error fetching attendance records:", attendanceError);
          return;
        }

        // Mapear los registros de asistencia a los empleados
        const employeesWithAttendance = employeesData.map((employee) => ({
          ...employee,
          attendance: attendanceData.filter(
            (record) => record.employee_id === employee.id
          ),
        }));

        setEmployees(employeesWithAttendance);
      } catch (error) {
        console.error("Unexpected error fetching employees and attendance:", error);
      }
    };

    fetchEmployeesWithAttendance();
  }, []); // Ejecutar solo al cargar la página

  // Filtrar registros según los filtros seleccionados
  useEffect(() => {
    const filterAttendance = () => {
      const filtered = employees.flatMap((employee) =>
        employee.attendance
          .filter((record) => {
            // Filtro por empleado
            if (selectedEmployeeId !== null && employee.id !== selectedEmployeeId) {
              return false;
            }

            // Filtro por rango de fechas
            const recordDate = normalizeDate(new Date(record.date)).getTime();
            const start = startDate ? normalizeDate(startDate).getTime() : null;
            const end = endDate ? normalizeDate(endDate).getTime() : null;

            if (start !== null && recordDate < start) return false;
            if (end !== null && recordDate > end) return false; // Incluir el día final

            // Filtro por tipo de registro
            if (recordType && record.type !== recordType) {
              return false;
            }

            return true;
          })
          .map((record) => ({
            ...record,
            employeeName: employee.name,
          }))
      );

      setFilteredAttendanceHistory(filtered);
    };

    filterAttendance();
  }, [employees, selectedEmployeeId, startDate, endDate, recordType]); // Dependencias para actualizar automáticamente

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-4xl mt-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Historial de Asistencia de Empleados
        </h1>

        {/* Filtros */}
        <form className="flex flex-col gap-4 mb-6">
          {/* Selección de empleado */}
          <div>
            <label htmlFor="employeeSelect" className="block text-sm font-medium mb-1">
              Seleccionar Empleado:
            </label>
            <select
              id="employeeSelect"
              className="w-full border rounded px-3 py-2"
              value={selectedEmployeeId || ""}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value) || null)}
            >
              <option value="">Todos los empleados</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para rango de fechas */}
          <div>
            <button
              type="button"
              className="w-full border rounded px-3 py-2 bg-blue-900 text-white"
              onClick={() => setIsDateRangeModalOpen(true)}
            >
              {startDate && endDate
                ? `Desde ${startDate.toLocaleDateString()} hasta ${endDate.toLocaleDateString()}`
                : "Seleccionar Rango de Fechas"}
            </button>
          </div>

          {/* Filtro por tipo de registro */}
          <div>
            <label htmlFor="recordType" className="block text-sm font-medium mb-1">
              Tipo de Registro:
            </label>
            <select
              id="recordType"
              className="w-full border rounded px-3 py-2"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
        </form>

        {/* Modal para rango de fechas */}
        <Modal
          isOpen={isDateRangeModalOpen}
          onClose={() => setIsDateRangeModalOpen(false)}
          title="Seleccionar Rango de Fechas"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Desde:</label>
              <Calendar
                onChange={(date) => setStartDate(date as Date)}
                value={startDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hasta:</label>
              <Calendar
                onChange={(date) => setEndDate(date as Date)}
                value={endDate}
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

        {/* Tabla de asistencia */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Registros Filtrados</h2>
          {filteredAttendanceHistory.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hora</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Empleado</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.type}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.employeeName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No hay registros que coincidan con los filtros.</p>
          )}
        </div>
      </main>
    </div>
  );
}