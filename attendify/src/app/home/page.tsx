"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4">
      <main className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-900">
          Bienvenido a Attendify
        </h2>
        <p className="text-center">
          Esta es la página principal después de iniciar sesión.
        </p>
      </main>
    </div>
  );
}