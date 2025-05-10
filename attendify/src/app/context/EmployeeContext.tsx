"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

// Exportar el tipo AttendanceRecord
export interface AttendanceRecord {
  date: string;
  time: string;
  type: "entrada" | "salida";
}

// Exportar el tipo Employee
export interface Employee {
  id: number;
  name: string;
  position: string;
  attendance: AttendanceRecord[];
}

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addAttendance: (employeeId: number, record: AttendanceRecord) => Promise<void>;
  getAttendanceHistory: (employeeId: number) => AttendanceRecord[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Cargar empleados desde Supabase
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select(`
        id, name, position,
        attendance: attendance (date, time, type)
      `);
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data || []);
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

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        addAttendance,
        getAttendanceHistory: (employeeId: number) =>
          employees.find((e) => e.id === employeeId)?.attendance || [],
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