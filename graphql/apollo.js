const { typeDefs, resolvers } = require('./schema/index')
const { ApolloServer, ForbiddenError } = require('apollo-server-fastify')
const jwt = require('jsonwebtoken')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: async ({ req }) => {
    if(!req) return null
    const token = req.headers['x-token']
    if (token) {
      try {
        const me = await jwt.verify(token, process.env.SECRET)
        return { me }
      } catch (e) {
        return new ForbiddenError('Your session expired. Sign in again.')
      }
    }
    return {}
  }
})

module.exports = server