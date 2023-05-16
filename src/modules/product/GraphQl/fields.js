import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql"
import productModel from "../../../../DB/model/ProductModel.js"
import { categoryType, productType } from "./types.js"
import categoryModel from "../../../../DB/model/CategoryModel.js"
import { validationGraphQl } from "../../../middleware/validation.js"
import { updateProductSchema } from "../product.validation.js"
import { authGraphQl } from "../../../middleware/auth.js"
import { endPoints } from "../product.endPoint.js"


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
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args) => {
      try {
        await validationGraphQl(updateProductSchema, args)
        const user = await authGraphQl(
          args.authorization,
          endPoints.updateProduct,
        )
        const product = await productModel.findByIdAndUpdate(
          args.id,
          {
            stock: args.stock,
            updatedBy: user._id,
          },
          {
            new: true,
          },
        )
        return product
      } catch (error) {
        throw new Error(error)
      }
      
    },
  }
  export const getAllCategories = {
    type: new GraphQLList(categoryType),
    resolve: async () => {
      const categories = await categoryModel.find().populate('subCategories')
      return categories
    },
  }