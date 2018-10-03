import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import _ from 'lodash';
import BookType from './books';

const books = [
  { id: '1', name: 'il', genre: 'ee', year:'year', authorId: '1'},
  { id: '2', name: 'il', genre: 'ee', year:'year', authorId: '2'},
  { id: '3', name: 'gere rhe', genre: 'poetry', year:'musket', authorId: '2'}
]

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
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id})
      }
    },
  })
});

export default AuthorType;