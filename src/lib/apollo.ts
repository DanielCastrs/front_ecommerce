import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

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
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
