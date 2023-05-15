import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { getAllCategories, getAllProductFields, getProductById, updateProduct } from "./fields.js";



export const productSchema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name: 'ProductSchema',
        description: 'This is the product schema',
        fields: {
            getAllProducts:getAllProductFields,
            getProductById:getProductById,
            getAllCategories: getAllCategories
        }
    }),
    mutation: new GraphQLObjectType({
      name: 'mutationSchemas',
      description: 'This is the mutations',
      fields: {
        updateProduct: updateProduct,
      },
    }),
})