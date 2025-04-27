"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "./context/UserContext";

export default function Login() {
  const router = useRouter();
  const { setCurrentUser } = useUser(); // Obtener la función para establecer el usuario actual
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Listas de usuarios válidos
  const adminUsers = [
    { id: 1, username: "admin", password: "1234", name: "Admin User", role: "admin" as "admin" },
  ];
  
  const employeeUsers = [
    { id: 2, username: "jcbodoque", password: "1234", name: "Juan Carlos Bodoque", role: "employee" as "employee" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Verificar si es un administrador
    const admin = adminUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (admin) {
      setCurrentUser(admin); // Establecer el usuario actual
      router.push("/admin/home"); // Redirigir al home del administrador
      return;
    }

    // Verificar si es un empleado
    const employee = employeeUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (employee) {
      setCurrentUser(employee); // Establecer el usuario actual
      router.push("/registro"); // Redirigir a la vista de registro
      return;
    }

    // Si no coincide con ningún usuario
    setError("Usuario o contraseña incorrectos.");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6 text-blue-900">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white font-medium py-2 rounded hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}