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

export const GET_ORDER = gql`
  query Order($id: ID!) {
    order(id: $id) {
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
