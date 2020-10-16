'use strict'

const fp = require('fastify-plugin')

const { gql } = require('apollo-server')


const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')


// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })

  fastify.decorate('someSupports', {
    a: 'hugs supports'
  })

  fastify.decorate('index_typeDefs', {
    gpl:gql`
      type Query {
        hello: String
      }
    
      type Mutation {
        test: Boolean
      }
    `})

  fastify.decorate('index_resolvers', {
    Query: {
      hello: () => 'world'
    },
    Mutation: {
      test: () => 'test'
    }
  })

  fastify.decorate('mail', (nodemailer, smtpTransport) => {
    
    let transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.USERMAIL,
        pass: process.env.USERPASS
      }
    }))

    const mailOptions = {
      from: 'leebond88@yahoo.com.tw',
      to: input.email,
      subject: 'Confrimation Email',
      html: '<h1>Hello</h1>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);  
      } else {
        console.log('Email sent: ' + info.response);  
      }   
    })
  
  })
})
