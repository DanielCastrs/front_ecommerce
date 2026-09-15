import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query Orders {
    orders {
      id
      status
      total
      createdAt
      items {
        name
        quantity
        subtotal
      }
    }
  }
`;
