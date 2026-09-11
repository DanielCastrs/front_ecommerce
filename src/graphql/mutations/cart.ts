import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
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

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
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
