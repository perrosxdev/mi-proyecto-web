"use client";

import { useState } from "react";
import { useEmployees } from "@/app/context/EmployeeContext";
import { PageHeader } from "@/app/components/PageHeader";
import Modal from "@/app/components/Modal";

export default function GestionEmpleados() {
  const { employees, setEmployees, getAttendanceHistory } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", onConfirm: () => {} });

  const openModal = (title: string, message: string, onConfirm: () => void) => {
    setModalContent({ title, message, onConfirm });
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id: number) => {
    openModal(
      "Eliminar Empleado",
      "¿Estás seguro de que deseas eliminar este empleado?",
      () => {
        setEmployees(employees.filter((employee) => employee.id !== id));
        setIsModalOpen(false);
      }
    );
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      openModal("Error", "Por favor, completa todos los campos.", () => setIsModalOpen(false));
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
    openModal("Éxito", "Empleado agregado correctamente.", () => setIsModalOpen(false));
  };
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
      openModal("Error", "Por favor, completa todos los campos.", () => setIsModalOpen(false));
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
    openModal("Éxito", "Empleado actualizado correctamente.", () => setIsModalOpen(false));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <PageHeader
        title="Gestión de Empleados"
        subtitle="Administra la información de los empleados de tu organización"
      />

      <main className="bg-card rounded-lg shadow p-6">
        {/* Lista de empleados */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-primary">Lista de Empleados</h2>
          {employees.length > 0 ? (
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-2 text-left text-secondary-foreground">Nombre</th>
                  <th className="px-4 py-2 text-left text-secondary-foreground">Posición</th>
                  <th className="px-4 py-2 text-left text-secondary-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted">
                    <td className="px-4 py-2 border-b border-border">{employee.name}</td>
                    <td className="px-4 py-2 border-b border-border">{employee.position}</td>
                    <td className="px-4 py-2 border-b border-border">
                      <button
                        className="px-2 py-1 rounded mr-2 bg-blue-900 text-white"
                        onClick={() => handleEditEmployee(employee.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-destructive text-white"
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
            <p className="text-muted-foreground">No hay empleados registrados.</p>
          )}
        </div>

        {/* Formulario para agregar o editar empleados */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-primary">
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
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
                Nombre:
              </label>
              <input
                id="name"
                type="text"
                className="w-full border rounded px-3 py-2 bg-input text-foreground"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-1 text-foreground">
                Posición:
              </label>
              <input
                id="position"
                type="text"
                className="w-full border rounded px-3 py-2 bg-input text-foreground"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </div>
            <button type="submit" className="w-full border rounded px-3 py-2 bg-blue-900 text-white">
              {isEditing ? "Guardar Cambios" : "Agregar Empleado"}
            </button>
          </form>
        </div>
      </main>

      {/* Modal */}
      <Modal
  isOpen={isModalOpen}
  title={modalContent.title} // No se pasa onClose
>
  <p>{modalContent.message}</p>
  <div className="flex justify-end gap-4 mt-4">
    <button
      onClick={() => setIsModalOpen(false)}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
    >
      Cerrar
    </button>
    <button
      onClick={() => {
        modalContent.onConfirm();
      }}
      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
    >
      Confirmar
    </button>
  </div>
</Modal>
    </div>
  );
}