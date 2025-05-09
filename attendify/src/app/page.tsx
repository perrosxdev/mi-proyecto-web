"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "./context/UserContext";
import { supabase } from "@/lib/supabaseClient"; // Importar el cliente de Supabase

export default function Login() {
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
  
    // Consultar el usuario en Supabase con un JOIN para obtener el nombre del empleado
    const { data: user, error: loginError } = await supabase
      .from("users")
      .select(`
        id,
        username,
        role,
        employee_id,
        employees (name)
      `)
      .eq("username", username)
      .eq("password", password)
      .single();
  
    console.log("Usuario obtenido desde Supabase:", user); // Depuración
  
    if (loginError || !user) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
  
    // Establecer el usuario actual en el contexto
    await new Promise<void>((resolve) => {
      setCurrentUser({
        id: user.id,
        username: user.username,
        name: user.employees?.name || "Sin nombre", // Obtener el nombre desde employees
        role: user.role,
      });
      resolve();
    });
  
    console.log("Usuario establecido en el contexto:", {
      id: user.id,
      username: user.username,
      name: user.employees?.name || "Sin nombre",
      role: user.role,
    }); // Depuración
  
    // Redirigir según el rol del usuario
    if (user.role === "admin") {
      router.push("/admin/home");
    } else if (user.role === "employee") {
      router.push("/registro");
    }
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