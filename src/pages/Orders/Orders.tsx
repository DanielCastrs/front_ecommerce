import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_ORDERS } from "../../graphql/queries/order";
import { CANCEL_ORDER } from "../../graphql/mutations/order";

import { ErrorMessage, Loading } from "../../components/Feedback/ErrorMessage";

interface OrderItem {
  name: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersData {
  orders: Order[];
}

export function Orders() {
  const { data, loading, error } = useQuery<OrdersData>(GET_ORDERS);
  const [cancelOrder, { loading: cancelling }] = useMutation(CANCEL_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  async function handleCancelOrder(orderId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar este pedido?",
    );

    if (!confirmed) return;

    try {
      await cancelOrder({
        variables: {
          id: orderId,
        },
      });
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Loading message="Carregando pedidos..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <ErrorMessage message="Não foi possível carregar seus pedidos." />
      </main>
    );
  }

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">📦 Meus Pedidos</h1>

        <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
          <p className="text-lg text-gray-600">
            Você ainda não possui pedidos.
          </p>

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

  function getStatusStyle(status: string) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "PAID":
        return "Pago";

      case "CANCELLED":
        return "Cancelado";

      case "PENDING":
        return "Aguardando pagamento";

      default:
        return status;
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">📦 Meus Pedidos</h1>

      <section className="mt-8 space-y-6">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl bg-white p-6 shadow">
            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row">
              <div>
                <Link
                  to={`/pedidos/${order.id}`}
                  className="font-bold text-gray-900 hover:text-blue-600 hover:underline"
                >
                  Pedido #{order.id}
                </Link>

                <p className="mt-1 text-sm text-gray-500">
                  Data: {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                    order.status,
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                {order.status === "PENDING" && (
                  <>
                    <Link
                      to={`/pagamento/${order.id}`}
                      className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      💳 Pagar pedido
                    </Link>

                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={() => handleCancelOrder(order.id)}
                      className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ❌ {cancelling ? "Cancelando..." : "Cancelar pedido"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-700">
                    R$ {item.subtotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t pt-4">
              <span className="font-bold text-gray-800">Total</span>

              <span className="text-xl font-bold text-blue-600">
                R$ {order.total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
