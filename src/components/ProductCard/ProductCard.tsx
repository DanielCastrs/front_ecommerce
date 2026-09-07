import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-48 items-center justify-center bg-gray-100">
        <span className="text-5xl">📱</span>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900">
          {name}
        </h2>

        <p className="mt-2 min-h-12 text-sm text-gray-600">
          {description}
        </p>

        <p className="mt-4 text-2xl font-bold text-blue-600">
          R$ {price.toFixed(2).replace('.', ',')}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Estoque: {stock}
        </p>

        <Link
            to={`/produtos/${id}`}
            className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
>
            Ver produto
        </Link>
      </div>
    </article>
  );
}