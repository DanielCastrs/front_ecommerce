import { useQuery } from '@apollo/client/react';
import { Link, useParams } from 'react-router-dom';

import { GET_PRODUCT } from '../../graphql/queries/product';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
}

interface ProductData {
  product: Product;
}

export function ProductDetails() {
  const { id } = useParams();

  const { data, loading, error } = useQuery<ProductData>(
    GET_PRODUCT,
    {
      variables: {
        id,
      },
    },
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">
          Carregando produto...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">
          Erro ao carregar produto: {error.message}
        </p>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Produto não encontrado
        </h1>

        <Link
          to="/produtos"
          className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const product = data.product;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/produtos"
          className="text-blue-600 hover:underline"
        >
          ← Voltar para produtos
        </Link>

        <section className="mt-6 grid gap-8 rounded-xl bg-white p-8 shadow-md md:grid-cols-2">

          <div className="flex min-h-96 items-center justify-center rounded-xl bg-gray-100">
            <span className="text-8xl">📱</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {product.category && (
              <p className="mt-2 text-sm text-gray-500">
                Categoria: {product.category.name}
              </p>
            )}

            <p className="mt-6 text-gray-600">
              {product.description}
            </p>

            <p className="mt-8 text-4xl font-bold text-blue-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>

            <p className="mt-4 text-gray-600">
              Estoque disponível: {product.stock}
            </p>

            <button
              type="button"
              className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Adicionar ao carrinho
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}