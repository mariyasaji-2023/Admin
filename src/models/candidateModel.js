const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const candidateSchema = new mongoose.Schema({
    candidateName: { type: String, required: true },
    candidateId: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'candidate'], required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true })

candidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model('Candidate', candidateSchema)