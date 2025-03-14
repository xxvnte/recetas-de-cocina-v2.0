"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center p-4 bg-black shadow-md">
      <ul className="flex space-x-4">
        <li>
          <a href="/" className="px-3 py-2 text-white hover:text-gray-300">
            Inicio
          </a>
        </li>
        <li>
          <a
            href="/recipes"
            className="px-3 py-2 text-white hover:text-gray-300"
          >
            Explorar recetas
          </a>
        </li>
      </ul>

      <div className="flex space-x-2">
        {session ? (
          <a
            href="/profile"
            className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-600 hover:text-white rounded"
          >
            Perfil
          </a>
        ) : (
          <a
            href="/register"
            className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-600 hover:text-white rounded"
          >
            Registrarse
          </a>
        )}
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-600 hover:text-white rounded"
          >
            Cerrar Sesión
          </button>
        ) : (
          <a
            href="/login"
            className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-600 hover:text-white rounded"
          >
            Iniciar Sesión
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
