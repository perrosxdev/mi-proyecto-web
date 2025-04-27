"use client";

import { useState } from "react";
import { useEmployees } from "@/app/context/EmployeeContext";

export default function GestionEmpleados() {
  const { employees, setEmployees, getAttendanceHistory } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "" });

  // Agregar un nuevo empleado
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployeeData = {
      id: newId,
      name: newEmployee.name,
      position: newEmployee.position,
      attendance: [],
    };

    setEmployees([...employees, newEmployeeData]);
    setNewEmployee({ name: "", position: "" });
    alert("Empleado agregado correctamente.");
  };

  // Eliminar un empleado
  const handleDeleteEmployee = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      setEmployees(employees.filter((employee) => employee.id !== id));
      alert("Empleado eliminado correctamente.");
    }
  };

  // Editar un empleado
  const handleEditEmployee = (id: number) => {
    const employee = employees.find((e) => e.id === id);
    if (employee) {
      setNewEmployee({ name: employee.name, position: employee.position });
      setSelectedEmployee(id);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!newEmployee.name || !newEmployee.position) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setEmployees(
      employees.map((employee) =>
        employee.id === selectedEmployee
          ? { ...employee, name: newEmployee.name, position: newEmployee.position }
          : employee
      )
    );
    setIsEditing(false);
    setSelectedEmployee(null);
    setNewEmployee({ name: "", position: "" });
    alert("Empleado actualizado correctamente.");
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
          Gestión de Empleados
        </h1>

        {/* Lista de empleados */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Lista de Empleados</h2>
          {employees.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Posición</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.position}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="px-2 py-1 rounded mr-2"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }}
                        onClick={() => handleEditEmployee(employee.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-2 py-1 rounded"
                        style={{
                          backgroundColor: "var(--destructive)",
                          color: "var(--primary-foreground)",
                        }}
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No hay empleados registrados.</p>
          )}
        </div>

        {/* Formulario para agregar o editar empleados */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">
            {isEditing ? "Editar Empleado" : "Agregar Nuevo Empleado"}
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleSaveEdit() : handleAddEmployee();
            }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nombre:
              </label>
              <input
                id="name"
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-1">
                Posición:
              </label>
              <input
                id="position"
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              {isEditing ? "Guardar Cambios" : "Agregar Empleado"}
            </button>
          </form>
        </div>

        {/* Historial de asistencia de un empleado */}
        {selectedEmployee !== null && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Historial de Asistencia</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hora</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {getAttendanceHistory(selectedEmployee).map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}