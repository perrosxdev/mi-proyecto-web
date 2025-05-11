"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";
import { EmployeeProvider } from "./context/EmployeeContext";
import { WorkHoursProvider } from "@/app/context/WorkHoursContext";
import { VacationProvider } from "@/app/context/VacationContext";
import { UserProvider } from "./context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <html lang="en">
      <head>
        {/* Enlace al CDN de Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <EmployeeProvider>
            <WorkHoursProvider>
              <VacationProvider>
                {/* Renderiza el Navbar solo si no estás en la ruta de login */}
                {pathname !== "/" && <Navbar />}
                <main className="flex-grow p-4">{children}</main>
              </VacationProvider>
            </WorkHoursProvider>
          </EmployeeProvider>
        </UserProvider>
      </body>
    </html>
  );
}