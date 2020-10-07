const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{ type: String },
    password:{ type: String },
    username:{ type: String }
}, { collection: 'User' })

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel