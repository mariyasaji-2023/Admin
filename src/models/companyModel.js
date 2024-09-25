const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    registrationNo: { type: String, required: true, unique: true },
    gstNo: { type: String, required: true },
    companyId: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true },
    representative: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Add email field
    password: { type: String, required: true }, // Add password field
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true } // Reference to admin
}, { timestamps: true });

companySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Company', companySchema);
