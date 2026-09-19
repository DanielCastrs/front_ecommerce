import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { ErrorMessage, Loading } from "../../components/Feedback/ErrorMessage";
import { GET_PRODUCTS } from "../../graphql/queries/products";
import { ProductCard } from "../../components/ProductCard/ProductCard";

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

interface ProductsData {
  products: Product[];
}

export function Products() {
  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("busca") ?? "";

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    if (!searchTerm.trim()) return data.products;

    const term = searchTerm.trim().toLowerCase();
    return data.products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    );
  }, [data, searchTerm]);

  function clearSearch() {
    setSearchParams({});
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <Loading message="Carregando produtos..." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <ErrorMessage message="Não foi possível carregar os produtos." />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>

          {searchTerm ? (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-gray-600">
              Resultados para{" "}
              <span className="font-semibold text-gray-900">
                "{searchTerm}"
              </span>
              <button
                type="button"
                onClick={clearSearch}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Limpar busca
              </button>
            </p>
          ) : (
            <p className="mt-2 text-gray-600">
              Encontre o produto ideal para você.
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-600">
            Nenhum produto encontrado{searchTerm ? ` para "${searchTerm}"` : ""}
            .
          </p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
