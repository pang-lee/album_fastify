'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'hello'
  })

  fastify.post('/', async(request, reply) =>{
    console.log(request.param)
  })
}