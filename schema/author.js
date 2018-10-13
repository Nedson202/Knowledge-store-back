import {
  GraphQLObjectType,
  GraphQLString,
  // GraphQLList,
  GraphQLInt,
} from 'graphql';
// import _ from 'lodash';
// import BookType from './books';

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    // books: {
    //   // type: new GraphQLList(BookType),
    //   // resolve(parent, args) {
    //   //   return _.filter(books, { authorId: parent.id})
    //   // }
    // },
  })
});

export default AuthorType;
