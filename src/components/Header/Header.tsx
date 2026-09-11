import { useQuery } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";

import { GET_ME } from "../../graphql/queries/me";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MeData {
  me: User;
}

export function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  const { data } = useQuery<MeData>(GET_ME, {
    skip: !token,
  });

  function handleLogout() {
    localStorage.removeItem("accessToken");

    navigate("/login");
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🛒 Meu E-commerce
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Início
          </Link>

          <Link
            to="/produtos"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Produtos
          </Link>

          {data?.me ? (
            <>
              <Link
                to="/perfil"
                className="font-semibold text-gray-700 transition hover:text-blue-600"
              >
                👤 {data.me.name}
              </Link>

              <Link
                to="/carrinho"
                className="text-gray-700 transition hover:text-blue-600"
              >
                🛒 Carrinho
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-700 transition hover:text-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/carrinho"
                className="text-gray-700 transition hover:text-blue-600"
              >
                🛒 Carrinho
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
