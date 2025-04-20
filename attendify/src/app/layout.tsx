"use client";

import { usePathname } from "next/navigation"; // Importa usePathname
import "./globals.css";
import Navbar from "./components/Navbar";

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
        {/* Renderiza el Navbar solo si no estás en la ruta de login */}
        {pathname !== "/" && <Navbar />}
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}