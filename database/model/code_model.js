const mongoose = require('mongoose')

const CodeSchema = new mongoose.Schema({
    verify_code: { type: Number },
    email:{ type: String },
}, { collection: 'Code' })

const CodeModel = mongoose.model('Code', CodeSchema)

module.exports = CodeModel