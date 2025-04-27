import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importa el hook para detectar cambios de ruta
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../context/UserContext";
import { Settings as SettingsIcon } from "@mui/icons-material"; // Importa el ícono de configuración


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const [isAtTop, setIsAtTop] = useState(true); // Estado para controlar si el usuario está en la parte superior
  const menuRef = useRef<HTMLDivElement>(null); // Referencia al menú lateral
  const { currentUser } = useUser(); // Obtener el usuario actual
  const pathname = usePathname(); // Obtiene la ruta actual

  const toggleMenu = () => setIsOpen(!isOpen);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Contrae el menú
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cierra el menú automáticamente al cambiar de ruta
  useEffect(() => {
    setIsOpen(false); // Contrae el menú al cambiar de pantalla
  }, [pathname]);

  // Detecta si el usuario está en la parte superior de la página
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0); // Si el desplazamiento es 0, está en la parte superior
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Botón para abrir/cerrar el menú */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-full"
          onClick={toggleMenu}
        >
          <MenuIcon />
        </button>
      )}

      {/* Menú desplegable */}
      {isOpen && (
        <aside
          ref={menuRef} // Asigna la referencia al menú lateral
          className="fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white p-4 z-40"
        >
          <h1 className="text-lg font-bold mb-6">Attendify</h1>
          <nav className="flex flex-col gap-4">
            {currentUser?.role === "admin" && (
              <>
                <Link href="/admin/home">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <HomeIcon /> Home
                  </button>
                </Link>
                <Link href="/admin/asistencia">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <EventNoteIcon /> Asistencia
                  </button>
                </Link>
                <Link href="/admin/gestion">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <GroupIcon /> Empleados
                  </button>
                </Link> 
                <Link href="/admin/asistencia/gestionAsistencia">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <AssignmentIcon /> Gestión de Asistencia
                  </button>
                </Link>   
                <Link href="/admin/configuracion">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <SettingsIcon /> Configuración
                  </button>
                </Link>            
              </>
            )}
            {currentUser?.role === "employee" && (
              <>
                <Link href="/registro">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <EventNoteIcon /> Registro
                  </button>
                </Link>
                <Link href="/vacaciones">
                  <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
                    <BeachAccessIcon /> Vacaciones
                  </button>
                </Link>
              </>
            )}
          </nav>
        </aside>
      )}

      {/* Nombre de Attendify siempre visible (excepto cuando el menú está abierto) */}
      {!isOpen && isAtTop && (
        <div className="fixed top-4 left-20 z-50 text-blue-900 font-bold text-lg">
          Attendify
        </div>
      )}
    </>
  );
}