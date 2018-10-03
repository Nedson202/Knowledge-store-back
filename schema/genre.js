import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    genre: { type: GraphQLString },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
  })
});

export default GenreType;
