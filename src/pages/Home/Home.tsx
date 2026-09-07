import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS } from '../../graphql/queries/products';
import { ProductCard } from '../../components/ProductCard/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductsData {
  products: Product[];
}

export function Home() {
  const { data, loading, error } =
    useQuery<ProductsData>(GET_PRODUCTS);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">
          Carregando produtos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">
          Erro ao carregar produtos: {error.message}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Encontre seu próximo produto
          </h1>

          <p className="mt-3 text-gray-600">
            Confira nossos produtos disponíveis
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </section>
      </div>
    </main>
  );
}