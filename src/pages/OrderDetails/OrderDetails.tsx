import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { GET_ORDER } from "../../graphql/queries/order";

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

interface OrderData {
  order: Order;
}

export function OrderDetails() {
  const { orderId } = useParams();

  const { data, loading, error } = useQuery<OrderData>(GET_ORDER, {
    variables: {
      id: orderId,
    },
    skip: !orderId,
  });

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

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-gray-600">Carregando pedido...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">
          Erro ao carregar pedido
        </h1>

        <p className="mt-2 text-sm text-gray-500">{error.message}</p>

        <Link
          to="/pedidos"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Voltar para pedidos
        </Link>
      </main>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Pedido não encontrado
        </h1>

        <p className="mt-2 text-gray-500">
          Não foi possível encontrar o pedido solicitado.
        </p>

        <Link
          to="/pedidos"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Voltar para pedidos
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/pedidos" className="text-blue-600 hover:underline">
          ← Voltar para pedidos
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
          {/* Cabeçalho */}
          <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido #{order.id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Data: {new Date(order.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                order.status,
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          {/* Produtos */}
          <section className="mt-6">
            <h2 className="text-xl font-bold text-gray-900">Produtos</h2>

            <div className="mt-4 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="rounded-lg border p-4"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantidade: {item.quantity}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>

                      <p className="text-lg font-bold text-blue-600">
                        R$ {item.subtotal.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total */}
          <div className="mt-8 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-lg font-bold text-gray-800">
              Total do pedido
            </span>

            <span className="text-3xl font-bold text-blue-600">
              R$ {order.total.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* Pagamento */}
          {order.status === "PENDING" && (
            <Link
              to={`/pagamento/${order.id}`}
              className="mt-6 block w-full rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
            >
              💳 Pagar pedido
            </Link>
          )}

          {order.status === "PAID" && (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-green-700">
              ✅ Este pedido já foi pago.
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-center text-red-700">
              ❌ Este pedido foi cancelado.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
