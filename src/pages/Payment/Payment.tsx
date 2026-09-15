import { useMutation, useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { PAY_ORDER } from "../../graphql/mutations/payment";
import { GET_ORDERS } from "../../graphql/queries/order";

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

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface PayOrderData {
  payOrder: Payment;
}

interface PayOrderVariables {
  input: {
    orderId: string;
    method: "PIX" | "CREDIT_CARD" | "BOLETO";
  };
}

export function Payment() {
  const { orderId } = useParams();

  const { data, loading: loadingOrders } = useQuery<OrdersData>(GET_ORDERS);

  const [payOrder, { loading: paying }] = useMutation<
    PayOrderData,
    PayOrderVariables
  >(PAY_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const order = data?.orders.find((item) => item.id === orderId);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentError, setPaymentError] = useState("");

  async function handlePayment(method: "PIX" | "CREDIT_CARD" | "BOLETO") {
    if (!orderId) return;

    setPaymentError("");

    try {
      const response = await payOrder({
        variables: {
          input: {
            orderId,
            method,
          },
        },
      });

      const result = response.data?.payOrder;

      if (result) {
        setPayment(result);
      }
    } catch (error) {
      console.error("Erro ao realizar pagamento:", error);

      setPaymentError(
        "Não foi possível realizar o pagamento. Tente novamente.",
      );
    }
  }

  if (loadingOrders) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-gray-600">Carregando pedido...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Pedido não encontrado
        </h1>

        <Link
          to="/pedidos"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Voltar para pedidos
        </Link>
      </main>
    );
  }
  if (payment) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          {payment.status === "APPROVED" ? (
            <>
              <div className="text-6xl">✅</div>

              <h1 className="mt-4 text-3xl font-bold text-green-600">
                Pagamento aprovado!
              </h1>

              <p className="mt-3 text-gray-600">
                Seu pagamento foi processado com sucesso.
              </p>

              <p className="mt-6 text-xl font-bold text-gray-900">
                R$ {payment.amount.toFixed(2).replace(".", ",")}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Método: {payment.method}
              </p>

              <Link
                to="/pedidos"
                className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Ver meus pedidos
              </Link>
            </>
          ) : (
            <>
              <div className="text-6xl">❌</div>

              <h1 className="mt-4 text-3xl font-bold text-red-600">
                Pagamento não aprovado
              </h1>

              <p className="mt-3 text-gray-600">
                Não foi possível aprovar o pagamento.
              </p>

              <Link
                to="/pedidos"
                className="mt-8 inline-block rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white"
              >
                Voltar para pedidos
              </Link>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Pagamento</h1>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">Pedido #{order.id}</h2>

        <p className="mt-2 text-gray-600">Status: {order.status}</p>

        <p className="mt-4 text-2xl font-bold text-blue-600">
          R$ {order.total.toFixed(2).replace(".", ",")}
        </p>
      </div>
      {paymentError && (
        <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
          {paymentError}
        </div>
      )}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">
          Escolha a forma de pagamento
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <button
            type="button"
            disabled={paying}
            onClick={() => handlePayment("PIX")}
            className="rounded-lg border-2 border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-3xl">💠</span>

            <h3 className="mt-3 font-bold">PIX</h3>

            <p className="mt-1 text-sm text-gray-500">Pagamento via PIX</p>
          </button>

          <button
            type="button"
            disabled={paying}
            onClick={() => handlePayment("CREDIT_CARD")}
            className="rounded-lg border-2 border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-3xl">💳</span>

            <h3 className="mt-3 font-bold">Cartão de crédito</h3>

            <p className="mt-1 text-sm text-gray-500">Pagamento via cartão</p>
          </button>

          <button
            type="button"
            disabled={paying}
            onClick={() => handlePayment("BOLETO")}
            className="rounded-lg border-2 border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-3xl">📄</span>

            <h3 className="mt-3 font-bold">Boleto</h3>

            <p className="mt-1 text-sm text-gray-500">Pagamento via boleto</p>
          </button>
        </div>

        {paying && (
          <p className="mt-6 text-center font-semibold text-blue-600">
            Processando pagamento...
          </p>
        )}
      </div>
    </main>
  );
}
