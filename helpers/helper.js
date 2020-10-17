const { ForbiddenError } = require('apollo-server')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const CodeModel = require('../database/model/code_model')

module.exports = {
    isAuthenticated: resolverFunction => (parent, args, context) => {
        if (!context.me) return new ForbiddenError('Not logged in.')
        return resolverFunction.apply(null, [parent, args, context])
    },
    mail: async (user) => {
        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                 user: process.env.USERMAIL,
                 pass: process.env.USERPASS
            }
        }))

        const generate_code = async () => {
            try {
               let random_code = ''
                for(let i= 0;i<6;i++){
                    random_code += parseInt(Math.random()*10)
                }
                await CodeModel.create({ verify_code: random_code, email: user.email })
                setTimeout(async ()=>{
                    await CodeModel.deleteMany({ verify_code: random_code, email: user.email })
                }, 1000*60*2)

                return random_code
            } catch (error) {
                console.log(error)
            }
        }

        let code = await generate_code()

        transporter.sendMail({
            from: 'leepang8834@gmail.com.tw',
            to: user.email,
            subject: 'Verify Your Identity',
            html: `
                <p>Hello! ${user.username}</p>
                <p>Your Verification Code Is：<strong style="color: #ff4e2a;">${code}</strong></p>
                <p>*** IT ONLY WORK WITHIN 2 MINUTES!! ***</p>
            `
        }, (error, info) => {
            if (error) {
                console.log(error)
                transporter.close()
            } else {     
                console.log('Email sent: ' + info.response)
            }
        })
        
        return code
    },
    verify: async (code) => {
        try {
            let find_code = await CodeModel.find({ verify_code: code })
            console.log(find_code)
            if(find_code.length == 0) return new ForbiddenError('Not Find Code')
            return find_code[0]
        } catch (error) {
            console.log(error)
        }
    }
}