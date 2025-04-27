"use client";

import { useState } from "react";

export default function Configuracion() {
  const [workHours, setWorkHours] = useState({ start: "09:00", end: "18:00" }); // Horarios laborales
  const [tolerance, setTolerance] = useState(10); // Tolerancia en minutos
  const [roles, setRoles] = useState([
    { id: 1, name: "Administrador", permissions: ["Gestionar empleados", "Ver reportes"] },
    { id: 2, name: "Empleado", permissions: ["Registrar asistencia"] },
  ]); // Roles y permisos
  const [newRole, setNewRole] = useState({ name: "", permissions: "" }); // Nuevo rol

  // Guardar cambios en los horarios laborales
  const handleSaveWorkHours = () => {
    alert(`Horarios laborales actualizados: ${workHours.start} - ${workHours.end}`);
  };

  // Guardar cambios en la tolerancia
  const handleSaveTolerance = () => {
    alert(`Tolerancia actualizada: ${tolerance} minutos`);
  };

  // Agregar un nuevo rol
  const handleAddRole = () => {
    if (!newRole.name || !newRole.permissions) {
      alert("Por favor, completa todos los campos para agregar un nuevo rol.");
      return;
    }

    setRoles([
      ...roles,
      { id: roles.length + 1, name: newRole.name, permissions: newRole.permissions.split(",") },
    ]);
    setNewRole({ name: "", permissions: "" });
    alert("Nuevo rol agregado correctamente.");
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
          Configuración
        </h1>

        {/* Horarios laborales */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Horarios Laborales</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium mb-1">
                Hora de inicio:
              </label>
              <input
                id="start"
                type="time"
                className="w-full border rounded px-3 py-2"
                value={workHours.start}
                onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium mb-1">
                Hora de fin:
              </label>
              <input
                id="end"
                type="time"
                className="w-full border rounded px-3 py-2"
                value={workHours.end}
                onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
              />
            </div>
            <button
              onClick={handleSaveWorkHours}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Guardar Horarios
            </button>
          </div>
        </div>

        {/* Tolerancia para llegadas tarde */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Tolerancia para Llegadas Tarde</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="tolerance" className="block text-sm font-medium mb-1">
                Tolerancia (minutos):
              </label>
              <input
                id="tolerance"
                type="number"
                className="w-full border rounded px-3 py-2"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
              />
            </div>
            <button
              onClick={handleSaveTolerance}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Guardar Tolerancia
            </button>
          </div>
        </div>

        {/* Roles y permisos */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Roles y Permisos</h2>
          <div className="flex flex-col gap-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Rol</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Permisos</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{role.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {role.permissions.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-md font-bold mt-4">Agregar Nuevo Rol</h3>
            <div>
              <label htmlFor="roleName" className="block text-sm font-medium mb-1">
                Nombre del Rol:
              </label>
              <input
                id="roleName"
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="permissions" className="block text-sm font-medium mb-1">
                Permisos (separados por comas):
              </label>
              <input
                id="permissions"
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newRole.permissions}
                onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
              />
            </div>
            <button
              onClick={handleAddRole}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Agregar Rol
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}