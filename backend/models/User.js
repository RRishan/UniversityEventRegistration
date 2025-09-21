const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // 👨‍🎓 Student Profile (only for students)
  studentProfile: {
    regiNumber: { type: String, unique: true, sparse: true }, // sparse = allow null for admins
    contactNum: { type: String, unique: true, sparse: true },
    faculty: { type: String },
    department: { type: String },
    isOrganizer: { type: Boolean, default: false } // I assume this is what you meant by isOrginzer
  },

  // 👨‍💼 Admin Profile (only for admins)
  adminProfile: {
    department: { type: String },
    role: { type: String, enum: ["approver", "admin"], default: '' }
  },

  // 🔑 Auth fields
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 }
})

const User = mongoose.model("User", userSchema)

module.exports = User;