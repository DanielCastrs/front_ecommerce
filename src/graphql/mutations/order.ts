import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder {
    createOrder {
      id
      status
      total
      items {
        name
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;
