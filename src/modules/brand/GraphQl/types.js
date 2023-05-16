import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../product/GraphQl/types.js";

export const brandType = new GraphQLObjectType({
    name: 'brandType',
    fields: {
        name: {
          type: GraphQLString,
        },
        createdBy: {
          type: GraphQLID,
        },
        updatedBy: {
          type: GraphQLID,
        },
        subCategoryId: {
          type: GraphQLID,
        },
        logo: {
          type: imageType('brandImageType'),
        },
        customId: {
          type: GraphQLString,
        },
      },
})