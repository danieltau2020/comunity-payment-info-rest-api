import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const usersSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    active: { type: Boolean, default: false },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    referralCode: { type: String, unique: true },
    referrer: { type: String, default: null },
    role: { type: String, default: "View" }
  },
  { timestamps: true }
)

usersSchema.statics.hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  } catch (error) {
    throw new Error("Hashing failed", error)
  }
}

usersSchema.statics.comparePasswords = async function (
  inputPassword,
  hashedPassword
) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword)
  } catch (error) {
    throw new Error("Comparision failed", error)
  }
}

const UsersModel = mongoose.model("User", usersSchema)

export default UsersModel
