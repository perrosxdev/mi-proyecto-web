"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

// Exportar el tipo AttendanceRecord
export interface AttendanceRecord {
  employee_id: number;
  date: string;
  time: string;
  type: "entrada" | "salida";
}

// Exportar el tipo Employee
export interface Employee {
  id: number;
  name: string;
  position: string;
  username?: string; // Nuevo campo para el nombre de usuario
  attendance: AttendanceRecord[];
}

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addAttendance: (employeeId: number, record: AttendanceRecord) => Promise<void>;
  getAttendanceHistory: (employeeId: number) => AttendanceRecord[];
  addEmployeeWithUser: (name: string, position: string) => Promise<string>; // Retorna el nombre de usuario
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Cargar empleados desde Supabase
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select(`
        id, 
        name, 
        position,
        attendance: attendance (employee_id, date, time, type),
        users (username) -- Incluir la relación con la tabla users
      `);

      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        const mappedEmployees = (data || []).map((employee: any) => ({
          ...employee,
          username: employee.users?.username || "N/A", // Asignar el nombre de usuario si existe
          attendance: employee.attendance || [], // Valor predeterminado
        }));
        setEmployees(mappedEmployees);
      }
    };

    fetchEmployees();
  }, []);

  // Agregar un registro de asistencia
  const addAttendance = async (employeeId: number, record: AttendanceRecord) => {
    const { error } = await supabase.from("attendance").insert({
      employee_id: employeeId,
      date: record.date,
      time: record.time,
      type: record.type,
    });
    if (error) {
      console.error("Error adding attendance:", error);
    } else {
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId
            ? { ...employee, attendance: [...(employee.attendance || []), record] }
            : employee
        )
      );
    }
  };

  // Nueva función: Agregar un empleado y crear un usuario relacionado
  const addEmployeeWithUser = async (name: string, position: string): Promise<string> => {
    if (!name || !position) {
      throw new Error("El nombre y la posición son obligatorios.");
    }
  
    try {
      // Verificar si el empleado ya existe
      const { data: existingEmployee, error: fetchError } = await supabase
        .from("employees")
        .select("*")
        .eq("name", encodeURIComponent(name)) // Codificar el nombre para evitar errores 406
        .maybeSingle(); // Cambiar a maybeSingle para evitar errores si no se encuentra el registro
  
      if (fetchError) {
        throw new Error("Error al verificar si el empleado ya existe.");
      }
  
      if (existingEmployee) {
        throw new Error(`El empleado con el nombre "${name}" ya existe.`);
      }
  
      // Insertar el empleado en la tabla "employees"
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .insert({
          name,
          position,
        })
        .select()
        .single();
  
      if (employeeError) {
        throw new Error("Error al agregar el empleado.");
      }
  
      // Generar el nombre de usuario
      const username = name.toLowerCase().replace(/\s+/g, "");
  
      // Crear un usuario relacionado en la tabla "users"
      const { error: userError } = await supabase.from("users").insert({
        username, // Generar un nombre de usuario basado en el nombre
        password: "password123", // Contraseña predeterminada
        role: "employee", // Rol predeterminado
        employee_id: employeeData.id, // Relación con el empleado recién creado
      });
  
      if (userError) {
        throw new Error("El empleado fue creado, pero no se pudo generar el usuario.");
      }
  
      // Actualizar el estado de empleados
      setEmployees((prevEmployees) => [
        ...prevEmployees,
        {
          id: employeeData.id,
          name,
          position,
          username, // Agregar el nombre de usuario al estado
          attendance: [],
        },
      ]);
  
      return username; // Retornar el nombre de usuario
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        addAttendance,
        getAttendanceHistory: (employeeId: number) =>
          employees.find((e) => e.id === employeeId)?.attendance || [],
        addEmployeeWithUser, // Exponer la nueva función en el contexto
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
}