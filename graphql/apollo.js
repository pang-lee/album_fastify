const { typeDefs, resolvers } = require('./schema/index')
const { ApolloServer, ForbiddenError } = require('apollo-server')
const UserModel = require('../database/model/user_model')
const jwt = require('jsonwebtoken')

module.exports = async (fastify, opts, next) => {
  const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: async ({ req }) => {
    try {
      if(!req) return null
      const token = req.headers['x-token']
      if (token) {
        const me = jwt.verify(token, process.env.SECRET)
        return { me, UserModel }        
      }
    } catch (error) {
      return new ForbiddenError('Your session expired. Sign in again.')
    }
    return { UserModel }
  }
})
        
  server.listen().then(({ url }) => {
    console.log(`Apollo Server ready at ${url}`)
  })
}
