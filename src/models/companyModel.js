const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    registrationNo: { type: String, required: true },
    gstNo: { type: String, required: true },
    companyId: { type: String, required: true },
    contactNo: { type: String, required: true },
    location: { type: String, required: true },
    representative: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Company',companySchema)