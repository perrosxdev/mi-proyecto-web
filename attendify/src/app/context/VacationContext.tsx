"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface VacationRequest {
  id: number;
  employeeId: number;
  employeeName: string; // Nombre del empleado
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

interface SupabaseVacationRequest {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  employees: { name: string }[]; // Cambiado a un arreglo
}

interface VacationContextType {
  vacationRequests: VacationRequest[];
  addVacationRequest: (request: Omit<VacationRequest, "id" | "status" | "employeeName">) => Promise<void>;
  updateVacationStatus: (requestId: number, status: "approved" | "rejected") => Promise<void>;
  getEmployeeVacations: (employeeId: number) => VacationRequest[];
  getPendingRequests: () => VacationRequest[];
}

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export function VacationProvider({ children }: { children: ReactNode }) {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

  // Cargar solicitudes de vacaciones desde Supabase con datos del empleado
  useEffect(() => {
    const fetchVacationRequests = async () => {
      const { data, error } = await supabase
        .from("vacation_requests")
        .select(`
          id,
          employee_id,
          start_date,
          end_date,
          status,
          reason,
          employees!vacation_requests_employee_id_fkey (name)
        `);
    
      if (error) {
        console.error("Error fetching vacation requests:", error);
      } else {
        // Mapear los datos para incluir el nombre del empleado
        const mappedRequests = (data || []).map((request: any) => ({
          id: request.id,
          employeeId: request.employee_id,
          employeeName: request.employees?.name || "Empleado no encontrado", // Acceder directamente al nombre
          startDate: request.start_date,
          endDate: request.end_date,
          status: request.status,
          reason: request.reason,
        }));
        setVacationRequests(mappedRequests);
      }
    };
    fetchVacationRequests();
  }, []);

  // Agregar nueva solicitud
  const addVacationRequest = async (request: Omit<VacationRequest, "id" | "status" | "employeeName">) => {
    const { data, error } = await supabase.from("vacation_requests").insert({
      employee_id: request.employeeId,
      start_date: request.startDate,
      end_date: request.endDate,
      reason: request.reason,
      status: "pending",
    }).select(`
      id,
      employee_id,
      start_date,
      end_date,
      status,
      reason,
      employees (name)
    `);

    if (error) {
      console.error("Error adding vacation request:", error);
    } else if (data) {
      // Agregar la nueva solicitud al estado
      const newRequests = (data as SupabaseVacationRequest[]).map((request) => ({
        id: request.id,
        employeeId: request.employee_id,
        employeeName: request.employees?.[0]?.name || "Empleado no encontrado", // Acceder al primer elemento del arreglo
        startDate: request.start_date,
        endDate: request.end_date,
        status: request.status,
        reason: request.reason,
      }));
      setVacationRequests((prev) => [...prev, ...newRequests]);
    }
  };

  // Actualizar estado de solicitud
  const updateVacationStatus = async (requestId: number, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("vacation_requests")
      .update({ status })
      .eq("id", requestId);
    if (error) {
      console.error("Error updating vacation status:", error);
    } else {
      setVacationRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? { ...request, status } : request
        )
      );
    }
  };

  return (
    <VacationContext.Provider
      value={{
        vacationRequests,
        addVacationRequest,
        updateVacationStatus,
        getEmployeeVacations: (employeeId) =>
          vacationRequests.filter((request) => request.employeeId === employeeId),
        getPendingRequests: () =>
          vacationRequests.filter((request) => request.status === "pending"),
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