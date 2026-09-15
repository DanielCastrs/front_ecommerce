import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

// Intercepta erros vindos da API
const errorLink = new ErrorLink(({ error }) => {
  const errorMessage = error.message.toLowerCase();

  const tokenInvalid =
    errorMessage.includes("token inválido") ||
    errorMessage.includes("token invalido") ||
    errorMessage.includes("expired") ||
    errorMessage.includes("unauthenticated");

  if (tokenInvalid) {
    console.log("Apollo - token inválido ou expirado");

    localStorage.removeItem("accessToken");

    window.location.href = "/login";
  }
});

// Adiciona o JWT automaticamente nas requisições
const authLink = new SetContextLink((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  console.log("Apollo - token encontrado:", token ? "SIM" : "NÃO");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});
