import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { reviewType } from "../../reviews/GraphQl/types.js";
import reviewModel from "../../../../DB/model/ReviewModel.js";
import { brandType } from "../../brand/GraphQl/types.js";
import brandModel from "../../../../DB/model/BrandModel.js";

export function imageType(name){
  return new GraphQLObjectType({
    name: name || 'ProductImageType',
    fields: {
      path: { type: new GraphQLNonNull(GraphQLString) },
      public_id: { type: new GraphQLNonNull(GraphQLString) },
    },
  })
} 
const customType = imageType()

  const subCategoryType = new GraphQLObjectType({
    name: 'subCategoryType',
    fields: {
      name: {
        type: GraphQLString,
      },
      Image: { type: imageType('subCategoryImageType') },
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
      Image: { type: imageType('categoryImageType') },
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
        mainImage: { type: customType },
        subImages: { type: new GraphQLList(customType) },
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
        brandInfo: {
          type: brandType,
          resolve: async (parent, __) => {
            const brand = await brandModel.findById(parent.brandId)
            return brand
          },
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

