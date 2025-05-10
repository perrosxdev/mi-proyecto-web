"use client";

import { useVacations } from "@/app/context/VacationContext";
import { useEmployees } from "@/app/context/EmployeeContext";
import { PageHeader } from "@/app/components/PageHeader";
import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export default function VacationManagement() {
  const { vacationRequests, updateVacationStatus, getPendingRequests } = useVacations();
  const { employees } = useEmployees();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredRequests =
    filter === "all"
      ? vacationRequests
      : filter === "pending"
      ? getPendingRequests()
      : vacationRequests.filter((req) => req.status === filter);

  const getEmployeeName = (id: number) => {
    return employees.find((e) => e.id === id)?.name || "Empleado no encontrado";
  };

  const handleStatusChange = async (requestId: number, newStatus: "approved" | "rejected") => {
    const confirmMessage =
      newStatus === "approved"
        ? "¿Estás seguro de que deseas aprobar esta solicitud?"
        : "¿Estás seguro de que deseas rechazar esta solicitud?";
  
    if (window.confirm(confirmMessage)) {
      try {
        await updateVacationStatus(requestId, newStatus);
        alert(`La solicitud ha sido ${newStatus === "approved" ? "aprobada" : "rechazada"} correctamente.`);
      } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error);
        alert("Ocurrió un error al actualizar el estado de la solicitud. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <PageHeader
        title="Gestión de Vacaciones"
        subtitle="Administra las solicitudes de vacaciones de los empleados"
      />

      <main className="bg-card rounded-lg shadow p-6">
        <div className="mb-4 flex items-center gap-4">
          <Typography variant="subtitle1" className="text-foreground">
            Filtrar por:
          </Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            size="small"
            className="bg-input text-foreground"
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="pending">Pendientes</MenuItem>
            <MenuItem value="approved">Aprobadas</MenuItem>
            <MenuItem value="rejected">Rechazadas</MenuItem>
          </Select>
        </div>

        <TableContainer component={Paper} className="bg-card">
          <Table>
            <TableHead>
              <TableRow className="bg-secondary">
                <TableCell className="text-secondary-foreground">Empleado</TableCell>
                <TableCell className="text-secondary-foreground">Fecha Inicio</TableCell>
                <TableCell className="text-secondary-foreground">Fecha Fin</TableCell>
                <TableCell className="text-secondary-foreground">Duración</TableCell>
                <TableCell className="text-secondary-foreground">Estado</TableCell>
                <TableCell className="text-secondary-foreground">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-muted">
                  <TableCell>{getEmployeeName(request.employeeId)}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>
                    {Math.ceil(
                      (new Date(request.endDate).getTime() -
                        new Date(request.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    días
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status === "pending"
                        ? "Pendiente"
                        : request.status === "approved"
                        ? "Aprobado"
                        : "Rechazado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          className="px-2 py-1 rounded mr-2 bg-blue-900 text-white"
                          variant="contained"
                          size="small"
                          onClick={() => handleStatusChange(request.id, "approved")}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="outlined"
                          style={{
                            borderColor: "var(--destructive)",
                            color: "var(--destructive)",
                          }}
                          size="small"
                          onClick={() => handleStatusChange(request.id, "rejected")}
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  );
}