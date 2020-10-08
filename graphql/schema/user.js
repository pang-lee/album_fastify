const { gql } = require('apollo-server')
const UserController = require('../../controller/user_controller')

const typeDefs = gql`
input loginInput{
  email:String!
  password:String!
}

input signupInput{
  username: String!
  email: String!
  password: String!
}

type user{
  email: String
  password: String
  username: String
}

type signup{
  id: ID!
  username: String!
  email: String!
  password: String!
  token: String
}

type login{
  id: ID!
  token: String!
}

extend type Query {
  getUser: user
  getUsers: [user]
}

extend type Mutation {
  signup(input: signupInput!): signup
  login(input: loginInput!): login
}

# extend type Mutation {
#   signup(input: signupInput!): String
#   login(input: loginInput!): String
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