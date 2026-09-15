import { gql } from "@apollo/client";

export const PAY_ORDER = gql`
  mutation PayOrder($input: CreatePaymentInput!) {
    payOrder(input: $input) {
      id
      amount
      method
      status
      createdAt
    }
  }
`;
