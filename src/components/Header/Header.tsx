import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          🛒 Meu E-commerce
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Início
          </Link>

          <Link
            to="/produtos"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Produtos
          </Link>

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
        </nav>

      </div>
    </header>
  );
}