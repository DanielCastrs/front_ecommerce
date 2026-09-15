import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";

import { LOGIN } from "../../graphql/mutations/auth";

interface LoginData {
  login: {
    accessToken: string;
  };
}

interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation<LoginData, LoginVariables>(
    LOGIN,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      const token = response.data?.login.accessToken;

      if (!token) {
        throw new Error("Token não recebido pelo backend");
      }

      localStorage.setItem("accessToken", token);
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-900">Login</h1>

        <p className="mt-2 text-center text-gray-500">Entre na sua conta</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              E-mail ou senha inválidos.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    </main>
  );
}
