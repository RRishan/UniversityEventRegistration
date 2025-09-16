const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    regiNumber: {type: String, required: true, unique: true},
    contactNum: {type: String, required: true, unique: true},
    faculty: {type: String, required: true},
    department: {type: String, required: true},
    password: {type: String, default: ''},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0}
})

const User = mongoose.model("User", userSchema)

module.exports = User;