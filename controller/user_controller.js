const { ForbiddenError } = require('apollo-server')
const helpers = require('../helpers/helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const UserController = {
    getAll: async (_, args, { UserModel }) => await UserModel.find({}),
    getMe: helpers.isAuthenticated(async(_, args, { me, UserModel }) => {
        return await UserModel.findById(me.uid._id)
    }),
    signUp: async (_, { input }, { UserModel }) => {
        try {
            let user = await UserModel.find({ email: input.email })
            if(user.length !== 0) return new ForbiddenError('Email Duplicate')
            let encrypt = await bcrypt.hash(input.password, Number(process.env.SALT_ROUNDS))
            let create = await UserModel.create({ id: uuidv4(), email: input.email, password: encrypt, username: input.username })
            let sign = { token: jwt.sign({ uid: `${input.email}` }, process.env.SECRET, { expiresIn: '1d' }) }
            return Object.assign(create, sign)
        } catch(e) {
            console.log(e.message)
        }
    },
    verify: async (_, { input }, { UserModel }) => {
        try {
            let user = await UserModel.find({ email: input.email })
            if(user.length == 0) return new ForbiddenError('Email Not Found')
            let passwordCompare = await bcrypt.compare(input.password, user[0].password)
            if(!passwordCompare) return new ForbiddenError('Password Not Same')
            return await helpers.mail(user[0])
        } catch(e) {
            console.log(e.message)
        }
    },
    logIn: async (_,  { code }, { UserModel }) => {
        try {
            let verify_info = await helpers.verify(code)
            if(verify_info !== 'Code Not Found Or Typo'){
                let user = await UserModel.find({ email: verify_info.email })
                let sign = { token: jwt.sign({ uid: user[0] }, process.env.SECRET, { expiresIn: '1d' }) }
                return Object.assign(user[0], sign)
            } else return new ForbiddenError(verify_info)
        } catch(e) {
            console.log(e.message)
        }
    }
}

module.exports = UserController