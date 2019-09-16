import {
  GraphQLSchema,
} from 'graphql';

import Mutation from './mutations/index';
import RootQuery from './queries';

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default graphqlSchema;
