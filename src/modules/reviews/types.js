import {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'


export const reviewType =new GraphQLList(new GraphQLObjectType({
  name: 'reviewType',
  fields: {
    text: {
      type: GraphQLString,
    },
    rate: {
      type: GraphQLFloat,
    },
    userId: {
      type: GraphQLID,
    },
    productId: {
      type: GraphQLID,
    },
  },
})) 






