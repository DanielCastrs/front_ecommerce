import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { apolloClient } from "../../lib/apollo";
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

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

// Componente declarado FORA do Header — assim o React reconhece
// que é sempre o mesmo componente entre renders e não perde o foco.
function SearchInput({
  value,
  onChange,
  onSubmit,
  className = "",
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar produtos..."
        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 transition hover:text-blue-600"
      >
        🔍
      </button>
    </form>
  );
}

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("accessToken");

  const { data, loading } = useQuery<MeData>(GET_ME, {
    skip: !token,
  });

  async function handleLogout() {
    localStorage.removeItem("accessToken");
    await apolloClient.clearStore();
    navigate("/login");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(
      trimmed ? `/produtos?busca=${encodeURIComponent(trimmed)}` : "/produtos",
    );
    closeMenu();
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
          onClick={closeMenu}
        >
          🛒 Meu E-commerce
        </Link>

        {/* Busca desktop */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearch}
          className="hidden max-w-md flex-1 md:block"
        />

        {/* Nav desktop */}
        <nav className="ml-auto hidden items-center gap-6 md:flex">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Início
          </Link>

          <Link
            to="/produtos"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Produtos
          </Link>

          {loading ? (
            <span className="text-sm text-gray-500">Carregando...</span>
          ) : data?.me ? (
            <>
              <Link
                to="/perfil"
                className="font-semibold text-gray-700 transition hover:text-blue-600"
              >
                👤 {data.me.name}
              </Link>

              <Link
                to="/pedidos"
                className="text-gray-700 transition hover:text-blue-600"
              >
                📦 Meus pedidos
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
            <Link
              to="/login"
              className="text-gray-700 transition hover:text-blue-600"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Botão sanduíche - só aparece no mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="ml-auto flex flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-0.5 w-6 bg-gray-700 transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-gray-700 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-gray-700 transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Nav mobile - dropdown */}
      {menuOpen && (
        <nav className="flex flex-col gap-4 border-t bg-white px-6 py-4 md:hidden">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearch}
          />

          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
            onClick={closeMenu}
          >
            Início
          </Link>

          <Link
            to="/produtos"
            className="text-gray-700 transition hover:text-blue-600"
            onClick={closeMenu}
          >
            Produtos
          </Link>

          {loading ? (
            <span className="text-sm text-gray-500">Carregando...</span>
          ) : data?.me ? (
            <>
              <Link
                to="/perfil"
                className="font-semibold text-gray-700 transition hover:text-blue-600"
                onClick={closeMenu}
              >
                👤 {data.me.name}
              </Link>

              <Link
                to="/pedidos"
                className="text-gray-700 transition hover:text-blue-600"
                onClick={closeMenu}
              >
                📦 Meus pedidos
              </Link>

              <Link
                to="/carrinho"
                className="text-gray-700 transition hover:text-blue-600"
                onClick={closeMenu}
              >
                🛒 Carrinho
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-gray-700 transition hover:text-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 transition hover:text-blue-600"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
