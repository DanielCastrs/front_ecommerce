import { gql } from "@apollo/client";

export const GET_MY_CART = gql`
  query MyCart {
    myCart {
      id
      total
      items {
        quantity
        subtotal
        product {
          id
          name
          price
        }
      }
    }
  }
`;
