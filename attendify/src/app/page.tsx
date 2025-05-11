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
  
    try {
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
        .single(); // Devuelve un único usuario
  
      if (loginError || !user) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
  
      // Extraer el nombre del empleado si existe
      const employeeName = user.employees?.[0]?.name || "Sin nombre";
  
      // Establecer el usuario actual en el contexto
      const userData = {
        id: user.id,
        username: user.username,
        name: employeeName,
        role: user.role,
      };
  
      setCurrentUser(userData);
  
      // Guardar el usuario en localStorage
      // console.log("Guardando usuario en localStorage:", userData); // Depuración
      localStorage.setItem("currentUser", JSON.stringify(userData));
  
      // Redirigir según el rol del usuario
      if (user.role === "admin") {
        router.push("/admin/home");
      } else if (user.role === "employee") {
        router.push("/registro");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
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