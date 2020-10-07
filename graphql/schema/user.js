const { gql } = require('apollo-server')
const UserController = require('../../controller/user_controller')

const typeDefs = gql`
input loginInput{
  email:String!,
  password:String!
}

type user{
  email: String
  password: String
  username: String
}

type signup{
  email: String
  password: String
  username: String
}

extend type Query {
  getUser: user
  getUsers: [user]
}

extend type Mutation {
  signup(email: String!, password: String!, username: String!): signup
  login(input: loginInput!): String
}

# extend type Mutation {
#   signup(email: String!, password: String!, username: String!): signup
#   login(email: String!, password: String!): String
# }
`

const resolvers = {
    Query: {
      getUsers: UserController.getAll,
      getUser: UserController.getMe
    },
    Mutation: {
      signup: UserController.signUp,
      login: UserController.logIn
    }
  }

module.exports = { typeDefs, resolvers }