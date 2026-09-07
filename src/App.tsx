import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS } from './graphql/queries/products';

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

function App() {
  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS);

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  if (error) {
    return <p>Erro ao carregar produtos: {error.message}</p>;
  }

  return (
    <main>
      <h1>Meu E-commerce</h1>

      <section>
        {data?.products.map((product) => (
          <article key={product.id}>
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <p>
              R$ {product.price.toFixed(2)}
            </p>

            <p>
              Estoque: {product.stock}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;