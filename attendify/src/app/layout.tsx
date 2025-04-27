"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú

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
            {/* Renderiza el Navbar solo si no estás en la ruta de login */}
            {pathname !== "/" && (
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            )}
            <main
              className={`flex-grow p-4 transition-all duration-300 ${
                isMenuOpen ? "ml-64" : "ml-0"
              }`}
            >
              {children}
            </main>
          </EmployeeProvider>
        </UserProvider>
      </body>
    </html>
  );
}