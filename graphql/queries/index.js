import {
  GraphQLObjectType,
} from 'graphql';

import BookQuery from './books';
import UserQuery from './users';
import ReviewQuery from './reviews';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...BookQuery,
    ...ReviewQuery,
    ...UserQuery,
  }
});

export default RootQuery;
