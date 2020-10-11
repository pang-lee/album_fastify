const { gql } = require('apollo-server-fastify')

const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ]

const typeDefs = gql`
type Book {
  title: String
  author: String
}

extend type Query {
  books: [Book]
}
`

const resolvers = {
    Query: {
      books: () => books
    }
}

module.exports = { typeDefs, resolvers }