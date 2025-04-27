"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AttendanceRecord {
  date: string; // Fecha del registro (YYYY-MM-DD)
  time: string; // Hora del registro (HH:mm)
  type: "entrada" | "salida"; // Tipo de registro
}

interface Employee {
  id: number;
  name: string;
  position: string;
  attendance: AttendanceRecord[]; // Registros de asistencia
}

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addAttendance: (employeeId: number, record: AttendanceRecord) => void;
  updateEmployee: (employeeId: number, updatedData: Partial<Employee>) => void;
  getAttendanceHistory: (employeeId: number) => AttendanceRecord[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Función para inicializar empleados predeterminados con fechas normalizadas
  const initializeDefaultEmployees = () => {
    const initialEmployees = [
      {
        id: 1,
        name: "Juan Pérez",
        position: "Desarrollador",
        attendance: [
          { date: "2025-04-01", time: "08:00", type: "entrada" },
          { date: "2025-04-01", time: "17:00", type: "salida" },
          { date: "2025-04-02", time: "08:15", type: "entrada" },
          { date: "2025-04-02", time: "17:10", type: "salida" },
        ],
      },
      {
        id: 2,
        name: "María López",
        position: "Diseñadora",
        attendance: [
          { date: "2025-04-01", time: "08:30", type: "entrada" },
          { date: "2025-04-01", time: "16:45", type: "salida" },
          { date: "2025-04-02", time: "08:20", type: "entrada" },
          { date: "2025-04-02", time: "17:00", type: "salida" },
        ],
      },
      {
        id: 3,
        name: "Carlos García",
        position: "Gerente",
        attendance: [
          { date: "2025-04-01", time: "07:50", type: "entrada" },
          { date: "2025-04-01", time: "18:00", type: "salida" },
          { date: "2025-04-02", time: "08:00", type: "entrada" },
          { date: "2025-04-02", time: "17:30", type: "salida" },
        ],
      },
    ];

    // Convertir las fechas de los registros a objetos Date
    const normalizedEmployees = initialEmployees.map((employee) => ({
      ...employee,
      attendance: employee.attendance.map((record) => ({
        ...record,
        date: new Date(record.date).toISOString().split("T")[0], // Normalizar la fecha
      })),
    }));

    console.log("Inicializando empleados con asistencia normalizada:", normalizedEmployees);
    setEmployees(normalizedEmployees);
    localStorage.setItem("employees", JSON.stringify(normalizedEmployees));
  };

  // Cargar la lista de empleados desde localStorage al montar el componente
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees);
      if (Array.isArray(parsedEmployees) && parsedEmployees.length === 0) {
        initializeDefaultEmployees();
      } else {
        const initializedEmployees = parsedEmployees.map((employee: Employee) => ({
          ...employee,
          attendance: employee.attendance.map((record) => ({
            ...record,
            date: new Date(record.date).toISOString().split("T")[0], // Normalizar la fecha
          })),
        }));
        console.log("Empleados cargados desde localStorage:", initializedEmployees);
        setEmployees(initializedEmployees);
      }
    } else {
      initializeDefaultEmployees();
    }
  }, []);

  // Guardar la lista de empleados en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
    console.log("Estado de empleados actualizado:", employees);
  }, [employees]);

  // Función para agregar un registro de asistencia
  const addAttendance = (employeeId: number, record: AttendanceRecord) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, attendance: [...(employee.attendance || []), record] }
          : employee
      )
    );
  };

  // Función para obtener el historial de asistencia de un empleado
  const getAttendanceHistory = (employeeId: number): AttendanceRecord[] => {
    const employee = employees.find((e) => e.id === employeeId);
    console.log("Empleado encontrado:", employee);
    console.log("Historial de asistencia obtenido:", employee?.attendance || []);
    return employee ? employee.attendance : [];
  };

  // Función para actualizar los datos de un empleado
  const updateEmployee = (employeeId: number, updatedData: Partial<Employee>) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId ? { ...employee, ...updatedData } : employee
      )
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        addAttendance,
        updateEmployee,
        getAttendanceHistory,
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