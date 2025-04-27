"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { format, toDate } from "date-fns-tz";

interface WorkInterval {
  start: string; // Hora de inicio (HH:mm)
  end: string; // Hora de fin (HH:mm)
}

interface WorkHoursContextType {
  intervals: WorkInterval[]; // Intervalos de trabajo
  tolerance: number; // Tolerancia en minutos
  setIntervals: (intervals: WorkInterval[]) => void;
  setTolerance: (tolerance: number) => void;
  hasCustomWorkHours: boolean; // Indica si el administrador definió un horario personalizado
}

const WorkHoursContext = createContext<WorkHoursContextType | undefined>(undefined);

export function WorkHoursProvider({ children }: { children: ReactNode }) {
  const [intervals, setIntervals] = useState<WorkInterval[]>([
    { start: "08:00", end: "13:00" },
    { start: "14:00", end: "16:00" },
  ]);
  const [tolerance, setTolerance] = useState<number>(10); // Tolerancia predeterminada

  const hasCustomWorkHours = intervals.length > 0; // Verifica si hay horarios personalizados

  // Convertir una hora a la zona horaria de Chile
  const convertToChileTime = (time: string) => {
    const date = toDate(`1970-01-01T${time}:00`, { timeZone: "UTC" }); // Crear una fecha en UTC
    const chileTime = toDate(date, { timeZone: "America/Santiago" }); // Convertir a la zona horaria de Chile
    return format(chileTime, "HH:mm"); // Formatear la hora
  };

  // Convertir los intervalos al horario de Chile
  const intervalsInChileTime = intervals.map((interval) => ({
    start: convertToChileTime(interval.start),
    end: convertToChileTime(interval.end),
  }));

  return (
    <WorkHoursContext.Provider
      value={{
        intervals: intervalsInChileTime,
        tolerance,
        setIntervals,
        setTolerance,
        hasCustomWorkHours,
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