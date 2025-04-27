"use client";

import { useState } from "react";
import { useWorkHours } from "@/app/context/WorkHoursContext";

interface Role {
  name: string;
  permissions: string[];
}

export default function Configuracion() {
  const { intervals, tolerance, setIntervals, setTolerance } = useWorkHours();
  const [newInterval, setNewInterval] = useState({ start: "", end: "" }); // Nuevo intervalo
  const [roles, setRoles] = useState<Role[]>([
    { name: "Administrador", 
      permissions: [
        "Gestionar empleados",
        "Gestionar asistencia",
        "Gestionar horarios laborales",
        "Gestionar roles y permisos",
        "Ver reportes",
      ], },
    { name: "Empleado", permissions: ["Registrar asistencia", "Solicitar Vacaciones"] },
  ]); // Roles iniciales
  const [newRole, setNewRole] = useState({ name: "", permissions: "" }); // Nuevo rol

  // Guardar cambios en los horarios laborales
  const handleSaveWorkHours = () => {
    if (!newInterval.start || !newInterval.end) {
      alert("Por favor, completa ambos campos para agregar un intervalo.");
      return;
    }

    setIntervals([...intervals, newInterval]); // Agregar el nuevo intervalo
    setNewInterval({ start: "", end: "" }); // Limpiar los campos
    alert("Horarios laborales actualizados.");
  };

  // Eliminar un intervalo
  const handleDeleteInterval = (index: number) => {
    const updatedIntervals = intervals.filter((_, i) => i !== index);
    setIntervals(updatedIntervals);
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
      { name: newRole.name, permissions: newRole.permissions.split(",") },
    ]);
    setNewRole({ name: "", permissions: "" });
    alert("Nuevo rol agregado correctamente.");
  };

  // Eliminar un rol
  const handleDeleteRole = (index: number) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
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
            {/* Lista de intervalos */}
            <ul className="list-disc pl-6">
              {intervals.map((interval, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {interval.start} - {interval.end}
                  </span>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDeleteInterval(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {/* Agregar nuevo intervalo */}
            <div className="flex gap-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium mb-1">
                  Hora de inicio:
                </label>
                <input
                  id="start"
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={newInterval.start}
                  onChange={(e) => setNewInterval({ ...newInterval, start: e.target.value })}
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
                  value={newInterval.end}
                  onChange={(e) => setNewInterval({ ...newInterval, end: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={handleSaveWorkHours}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "#1C398E",
                color: "#FFFFFF",
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
                backgroundColor: "#1C398E",
                color: "#FFFFFF",
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
            {/* Lista de roles */}
            <ul className="list-disc pl-6">
              {roles.map((role, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    <strong>{role.name}:</strong> {role.permissions.join(", ")}
                  </span>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDeleteRole(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {/* Agregar nuevo rol */}
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
                backgroundColor: "#1C398E",
                color: "#FFFFFF",
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