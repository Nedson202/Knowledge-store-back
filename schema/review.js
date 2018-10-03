import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID
} from 'graphql';
import _ from 'lodash';

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
      type: GraphQLID
    }
  })
});

export default ReviewType;