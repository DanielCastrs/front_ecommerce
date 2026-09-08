import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { GET_ME } from "../../graphql/queries/me";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MeData {
  me: User;
}

export function Profile() {
  const { data, loading, error } = useQuery<MeData>(GET_ME);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Erro ao carregar perfil
          </h1>

          <p className="mt-3 text-gray-600">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Meu perfil</h1>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>

              <p className="text-lg font-semibold">{data?.me.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>

              <p className="text-lg font-semibold">{data?.me.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Perfil</p>

              <p className="text-lg font-semibold">{data?.me.role}</p>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </main>
  );
}
