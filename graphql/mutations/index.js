import {
  GraphQLObjectType,
} from 'graphql';

import BookMutation from './books';
import FavoriteMutation from './favorites';
import UserMutation from './users';
import ReplyMutation from './replies';
import ReviewMutation from './reviews';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...BookMutation,
    ...FavoriteMutation,
    ...ReviewMutation,
    ...ReplyMutation,
    ...UserMutation,
  }
});

export default Mutation;
