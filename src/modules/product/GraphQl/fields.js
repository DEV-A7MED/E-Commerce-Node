import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql"
import productModel from "../../../../DB/model/ProductModel.js"
import { categoryType, productType } from "./types.js"
import categoryModel from "../../../../DB/model/CategoryModel.js"


export const getAllProductFields = {
    type: new GraphQLList(productType),
    resolve: async () => {
        const products = await productModel.find()
        return products
      },
}
export const getProductById = {
    type: productType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args) => {
      const products = await productModel.findById(args.id).populate('categoryId')
      return products
    },
  }
  export const updateProduct = {
    type: productType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      stock: { type: GraphQLInt },
    },
    resolve: async (parent, args) => {
      const product = await productModel.findByIdAndUpdate(
        args.id,
        {
          stock: args.stock,
        },
        {
          new: true,
        },
      )
  
      return product
    },
  }
  export const getAllCategories = {
    type: new GraphQLList(categoryType),
    resolve: async () => {
      const categories = await categoryModel.find().populate('subCategories')
      return categories
    },
  }