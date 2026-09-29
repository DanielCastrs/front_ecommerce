import { gql } from "@apollo/client";

export const GET_ADMIN_PRODUCTS = gql`
  query AdminProducts {
    products {
      id
      name
      description
      price
      stock
      categoryId
      category {
        id
        name
      }
    }
  }
`;
