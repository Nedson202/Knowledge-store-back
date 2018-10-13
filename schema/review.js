import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    reviewer: {
      type: GraphQLString
    },
    review: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLFloat
    }
  })
});

export default ReviewType;
