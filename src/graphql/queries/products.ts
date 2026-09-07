import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      description
      price
      stock
    }
  }
`;