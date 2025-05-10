"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface WorkHour {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string | null;
  totalHours: string | null; // Duración total en formato HH:mm
}

interface Interval {
  start: string;
  end: string;
}

interface WorkHoursContextType {
  workHours: WorkHour[];
  intervals: Interval[]; // Lista de intervalos de trabajo
  tolerance: number; // Tolerancia en minutos
  setIntervals: (intervals: Interval[]) => void; // Función para actualizar los intervalos
  setTolerance: (tolerance: number) => void; // Función para actualizar la tolerancia
  registerStartTime: (employeeId: number) => Promise<void>;
  registerEndTime: (employeeId: number) => Promise<void>;
  fetchWorkHours: (employeeId: number) => Promise<void>;
}

const WorkHoursContext = createContext<WorkHoursContextType | undefined>(undefined);

export function WorkHoursProvider({ children }: { children: ReactNode }) {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [intervals, setIntervals] = useState<Interval[]>([]); // Inicializar los intervalos
  const [tolerance, setTolerance] = useState<number>(5); // Inicializar la tolerancia con un valor predeterminado

  // Cargar las horas trabajadas de un empleado desde Supabase
  const fetchWorkHours = async (employeeId: number) => {
    const { data, error } = await supabase
      .from("work_hours")
      .select("*")
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error fetching work hours:", error);
    } else {
      setWorkHours(data || []);
    }
  };

  // Registrar la hora de entrada
  const registerStartTime = async (employeeId: number) => {
    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
    const now = new Date().toTimeString().split(" ")[0]; // Hora actual en formato HH:mm:ss

    // Verificar si ya existe un registro para hoy
    const { data: existingRecord, error: fetchError } = await supabase
      .from("work_hours")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing record:", fetchError);
      return;
    }

    if (existingRecord) {
      console.warn("Ya existe un registro de entrada para hoy.");
      return;
    }

    // Insertar un nuevo registro con la hora de entrada
    const { error } = await supabase.from("work_hours").insert({
      employee_id: employeeId,
      date: today,
      start_time: now,
    });

    if (error) {
      console.error("Error registering start time:", error);
    } else {
      await fetchWorkHours(employeeId); // Actualizar los registros locales
    }
  };

  // Registrar la hora de salida
  const registerEndTime = async (employeeId: number) => {
    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
    const now = new Date().toTimeString().split(" ")[0]; // Hora actual en formato HH:mm:ss

    // Verificar si existe un registro de entrada para hoy
    const { data: existingRecord, error: fetchError } = await supabase
      .from("work_hours")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (fetchError || !existingRecord) {
      console.error("No se encontró un registro de entrada para hoy.");
      return;
    }

    if (existingRecord.end_time) {
      console.warn("Ya se ha registrado una hora de salida para hoy.");
      return;
    }

    // Calcular la duración total
    const startTime = new Date(`1970-01-01T${existingRecord.start_time}Z`);
    const endTime = new Date(`1970-01-01T${now}Z`);
    const totalMilliseconds = endTime.getTime() - startTime.getTime();
    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    const totalDuration = `${totalHours}:${totalMinutes.toString().padStart(2, "0")}`;

    // Actualizar el registro con la hora de salida y la duración total
    const { error } = await supabase
      .from("work_hours")
      .update({ end_time: now, total_hours: totalDuration })
      .eq("id", existingRecord.id);

    if (error) {
      console.error("Error registering end time:", error);
    } else {
      await fetchWorkHours(employeeId); // Actualizar los registros locales
    }
  };

  return (
    <WorkHoursContext.Provider
      value={{
        workHours,
        intervals,
        tolerance,
        setIntervals,
        setTolerance,
        registerStartTime,
        registerEndTime,
        fetchWorkHours,
      }}
    >
      {children}
    </WorkHoursContext.Provider>
  );
}

export function useWorkHours() {
  const context = useContext(WorkHoursContext);
  if (!context) {
    throw new Error("useWorkHours must be used within a WorkHoursProvider");
  }
  return context;
}