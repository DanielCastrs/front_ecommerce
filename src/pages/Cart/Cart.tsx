import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import {
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../../graphql/mutations/cart";
import { GET_MY_CART } from "../../graphql/queries/cart";
import { CREATE_ORDER } from "../../graphql/mutations/order";

interface CartItem {
  quantity: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface Cart {
  id: string;
  total: number;
  items: CartItem[];
}

interface CartData {
  myCart: Cart;
}

interface UpdateCartItemData {
  updateCartItem: Cart;
}

interface UpdateCartItemVariables {
  input: {
    productId: string;
    quantity: number;
  };
}

interface RemoveFromCartData {
  removeFromCart: Cart;
}

interface RemoveFromCartVariables {
  productId: string;
}

interface ClearCartData {
  clearCart: Cart;
}

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface CreateOrderData {
  createOrder: Order;
}

export function Cart() {
  const { data, loading, error } = useQuery<CartData>(GET_MY_CART);

  const [updateCartItem, { loading: updatingCart }] = useMutation<
    UpdateCartItemData,
    UpdateCartItemVariables
  >(UPDATE_CART_ITEM);

  const [removeFromCart, { loading: removingFromCart }] = useMutation<
    RemoveFromCartData,
    RemoveFromCartVariables
  >(REMOVE_FROM_CART);

  const [clearCart, { loading: clearingCart }] =
    useMutation<ClearCartData>(CLEAR_CART);

  const [createOrder, { loading: creatingOrder }] =
    useMutation<CreateOrderData>(CREATE_ORDER);

  //quantidade de produtos
  async function handleUpdateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;

    try {
      await updateCartItem({
        variables: {
          input: {
            productId,
            quantity,
          },
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  }

  //remover card
  async function handleRemoveFromCart(productId: string) {
    try {
      await removeFromCart({
        variables: {
          productId,
        },
      });
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  }

  //limpar carrinho
  async function handleClearCart() {
    try {
      await clearCart();
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  }

  async function handleCreateOrder() {
    try {
      const response = await createOrder();

      console.log("Pedido criado com sucesso:", response.data?.createOrder);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-600">Carregando carrinho...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-red-600">Erro ao carregar o carrinho.</p>

        <p className="mt-2 text-sm text-gray-500">{error.message}</p>
      </main>
    );
  }

  const cart = data?.myCart;

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">🛒 Meu Carrinho</h1>

        <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
          <p className="text-lg text-gray-600">Seu carrinho está vazio.</p>

          <Link
            to="/produtos"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Ver produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">🛒 Meu Carrinho</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Produtos */}
        <section className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <article
              key={item.product.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.product.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Preço unitário: R${" "}
                    {item.product.price.toFixed(2).replace(".", ",")}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-gray-600">Quantidade:</span>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={updatingCart || item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 font-bold hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      -
                    </button>

                    <span className="min-w-6 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      disabled={updatingCart}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 font-bold hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    disabled={removingFromCart}
                    className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingFromCart ? "Removendo..." : "Remover produto"}
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>

                  <p className="text-xl font-bold text-blue-600">
                    R$ {item.subtotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Resumo */}
        <aside className="h-fit rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900">Resumo do pedido</h2>

          <div className="mt-6 flex justify-between border-t pt-4">
            <span className="font-semibold text-gray-700">Total</span>

            <span className="text-2xl font-bold text-blue-600">
              R$ {cart.total.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearingCart}
            className="mt-6 w-full rounded-lg border border-red-500 px-6 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearingCart ? "Limpando..." : "Limpar carrinho"}
          </button>

          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={creatingOrder}
            className="mt-3 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingOrder ? "Criando pedido..." : "Finalizar pedido"}
          </button>
        </aside>
      </div>
    </main>
  );
}
