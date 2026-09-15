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

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
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

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      id
      total
      items {
        quantity
      }
    }
  }
`;
