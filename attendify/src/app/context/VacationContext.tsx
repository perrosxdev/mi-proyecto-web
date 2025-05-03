"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Employee } from "./EmployeeContext";

export interface VacationRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

interface VacationContextType {
  vacationRequests: VacationRequest[];
  setVacationRequests: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
  addVacationRequest: (request: Omit<VacationRequest, "id" | "status">) => void;
  updateVacationStatus: (requestId: number, status: "approved" | "rejected") => void;
  getEmployeeVacations: (employeeId: number) => VacationRequest[];
  getPendingRequests: () => VacationRequest[];
}

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export function VacationProvider({ children }: { children: ReactNode }) {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

  // Inicializar datos de prueba
  const initializeDefaultVacations = () => {
    const defaultRequests: VacationRequest[] = [
      {
        id: 1,
        employeeId: 1,
        startDate: "2025-05-10",
        endDate: "2025-05-15",
        status: "pending",
        reason: "Vacaciones familiares"
      },
      {
        id: 2,
        employeeId: 2,
        startDate: "2025-06-01",
        endDate: "2025-06-10",
        status: "approved",
        reason: "Viaje al extranjero"
      },
      {
        id: 3,
        employeeId: 3,
        startDate: "2025-07-15",
        endDate: "2025-07-30",
        status: "pending",
        reason: "Descanso prolongado"
      }
    ];

    setVacationRequests(defaultRequests);
    localStorage.setItem("vacationRequests", JSON.stringify(defaultRequests));
  };

  // Cargar desde localStorage al montar
  useEffect(() => {
    const storedRequests = localStorage.getItem("vacationRequests");
    if (storedRequests) {
      setVacationRequests(JSON.parse(storedRequests));
    } else {
      initializeDefaultVacations();
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("vacationRequests", JSON.stringify(vacationRequests));
  }, [vacationRequests]);

  // Agregar nueva solicitud
  const addVacationRequest = (request: Omit<VacationRequest, "id" | "status">) => {
    const newRequest: VacationRequest = {
      ...request,
      id: Date.now(),
      status: "pending"
    };
    setVacationRequests(prev => [...prev, newRequest]);
  };

  // Actualizar estado de solicitud
  const updateVacationStatus = (requestId: number, status: "approved" | "rejected") => {
    setVacationRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  // Obtener vacaciones de un empleado
  const getEmployeeVacations = (employeeId: number) => {
    return vacationRequests.filter(request => request.employeeId === employeeId);
  };

  // Obtener solicitudes pendientes
  const getPendingRequests = () => {
    return vacationRequests.filter(request => request.status === "pending");
  };

  return (
    <VacationContext.Provider
      value={{
        vacationRequests,
        setVacationRequests,
        addVacationRequest,
        updateVacationStatus,
        getEmployeeVacations,
        getPendingRequests
      }}
    >
      {children}
    </VacationContext.Provider>
  );
}

export function useVacations() {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error("useVacations must be used within a VacationProvider");
  }
  return context;
}