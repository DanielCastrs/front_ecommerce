import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_PRODUCTS } from "../../graphql/queries/products";
import { ProductCard } from "../../components/ProductCard/ProductCard";

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

const BENEFITS = [
  { icon: "🚚", title: "Frete grátis", text: "Em compras acima de R$ 199" },
  {
    icon: "🔒",
    title: "Pagamento seguro",
    text: "Seus dados sempre protegidos",
  },
  { icon: "↩️", title: "Troca fácil", text: "Até 30 dias para trocar" },
  { icon: "⚡", title: "Entrega rápida", text: "Enviamos em até 24h" },
];

const FEATURED_COUNT = 8;

export function Home() {
  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Carregando produtos...</p>
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

  const featuredProducts = data?.products.slice(0, FEATURED_COUNT) ?? [];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Encontre seu próximo produto favorito
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            As melhores ofertas, direto para você. Confira nossa seleção.
          </p>

          <Link
            to="/produtos"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-b bg-white px-6 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 sm:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center text-center"
            >
              <span className="text-3xl">{benefit.icon}</span>
              <p className="mt-2 font-semibold text-gray-900">
                {benefit.title}
              </p>
              <p className="text-sm text-gray-500">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Produtos em destaque
              </h2>
              <p className="mt-1 text-gray-600">
                Selecionamos alguns dos nossos favoritos
              </p>
            </div>

            <Link
              to="/produtos"
              className="hidden font-semibold text-blue-600 transition hover:text-blue-700 sm:block"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <Link
            to="/produtos"
            className="mt-8 block text-center font-semibold text-blue-600 sm:hidden"
          >
            Ver todos os produtos →
          </Link>
        </div>
      </section>
    </main>
  );
}
