"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: number;
  username: string;
  name: string;
  role: "admin" | "employee";
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Recuperar el usuario del localStorage al cargar la aplicación (solo en el cliente)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !user) {
      console.error("Error logging in:", error);
      return false;
    }

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    setCurrentUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(userData)); // Guardar en localStorage
    }

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser"); // Eliminar del localStorage
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}