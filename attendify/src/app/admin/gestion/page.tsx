"use client";

import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import Modal from "@/app/components/Modal";
import { useEmployees } from "@/app/context/EmployeeContext"; // Importar el contexto

export default function GestionEmpleados() {
  const { employees, addEmployeeWithUser } = useEmployees(); // Usar el contexto
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "" }); // Datos del nuevo empleado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", onConfirm: () => {} });

  const openModal = (title: string, message: string, onConfirm: () => void) => {
    setModalContent({ title, message, onConfirm });
    setIsModalOpen(true);
  };

  // Función para agregar un empleado y crear un usuario
  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.position) {
      openModal("Error", "Por favor, completa todos los campos.", () => setIsModalOpen(false));
      return;
    }
  
    try {
      // Usar la función del contexto para agregar el empleado y crear el usuario
      const username = await addEmployeeWithUser(newEmployee.name, newEmployee.position);
  
      // Limpiar el formulario
      setNewEmployee({ name: "", position: "" });
      openModal(
        "Éxito",
        `Empleado y usuario creados correctamente. Nombre de usuario: ${username}`,
        () => setIsModalOpen(false)
      );
    } catch (error: any) {
      console.error(error);
      openModal("Error", error.message, () => setIsModalOpen(false));
    }
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
                        className="px-3 py-1 rounded-md bg-destructive text-white"
                        onClick={() => console.log("Eliminar empleado no implementado")}
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

        {/* Formulario para agregar empleados */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-primary">Agregar Nuevo Empleado</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddEmployee();
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
              Agregar Empleado
            </button>
          </form>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} title={modalContent.title}>
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