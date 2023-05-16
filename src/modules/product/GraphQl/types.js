import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { reviewType } from "../../reviews/types.js";
import reviewModel from "../../../../DB/model/ReviewModel.js";

const imageType = new GraphQLObjectType({
    name: 'ImageType',
    fields: {
      path: { type: new GraphQLNonNull(GraphQLString) },
      public_id: { type: new GraphQLNonNull(GraphQLString) },
    },
  })
  const subCategoryType = new GraphQLObjectType({
    name: 'subCategoryType',
    fields: {
      name: {
        type: GraphQLString,
      },
      Image: { type: imageType },
      createdBy: {
        type: GraphQLID,
      },
      slug: {
        type: GraphQLString,
      },
      updatedBy: {
        type: GraphQLID,
      },
      customId: { type: GraphQLString },
      categoryId: {
        type: GraphQLID,
      },
    },
  })
export const categoryType = new GraphQLObjectType({
    name: 'catgoryType',
    fields: {
      name: {
        type: GraphQLString,
      },
      Image: { type: imageType },
      createdBy: {
        type: GraphQLID,
      },
      slug: {
        type: GraphQLString,
      },
      updatedBy: {
        type: GraphQLID,
      },
      customId: { type: GraphQLString },
      subCategories: {
        type: new GraphQLList(subCategoryType),
      },
    },
  })

export const productType = new GraphQLObjectType({
    name: 'productType',
    fields: {
        _id:{ type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        rate: { type: GraphQLFloat },
        price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        priceAfterDiscount: { type: GraphQLFloat },
        stock: { type: GraphQLInt },
        colors: { type: new GraphQLList(GraphQLString) },
        size: { type: new GraphQLList(GraphQLString) },
        mainImage: { type: imageType },
        subImages: { type: new GraphQLList(imageType) },
        createdBy: {
          type: GraphQLID,
        },
        updatedBy: {
          type: GraphQLID,
        },
        categoryId: {
          type: categoryType,
        },
        subCategoryId: {
          type: GraphQLID,
        },
        brandId: {
          type: GraphQLID,
        },
        customId: {
          type: GraphQLString,
        },
        isDeleted: {
          type: GraphQLBoolean,
        },
        reviews:{
          type:reviewType,
          resolve:async(parent,__)=>{
            const reviews=await reviewModel.find({productId:parent._id})
            return reviews
          }
        }
      },

})

