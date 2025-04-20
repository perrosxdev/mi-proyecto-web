import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Navbar() {
  return (
    <header className="w-full bg-blue-900 text-white p-4 flex flex-wrap items-center justify-between">
      <h1 className="text-lg font-bold">Attendify</h1>
      <nav className="flex gap-4 flex-wrap items-center">
        <Link href="/home">
          <button className="hover:underline text-sm sm:text-base flex items-center gap-2">
            <HomeIcon /> Home
          </button>
        </Link>
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
        <button className="flex items-center">
          <PersonIcon className="text-lg sm:text-xl" />
        </button>
        <button className="flex items-center">
          <NotificationsIcon className="text-lg sm:text-xl" />
        </button>
      </nav>
    </header>
  );
}