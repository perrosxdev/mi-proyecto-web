"use client";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4 sm:p-8">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-4xl mt-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Bienvenido al Panel de Administración
        </h1>
        <p className="text-center text-gray-700">
          Aquí puedes gestionar usuarios, revisar reportes y administrar el sistema.
        </p>
        {/* Agrega más contenido o enlaces según sea necesario */}
      </main>
    </div>
  );
}