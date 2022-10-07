import jwt from "jsonwebtoken"

const options = {
  expiresIn: "30s"
}

export const generateJwt = async (userId, employee) => {
  try {
    const payload = { id: userId, ...employee }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)
    return { error: false, token: token }
  } catch (error) {
    return { error: true }
  }
}

export const generateRefreshJwt = async (userId) => {
  try {
    const payload = { id: userId }
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET)
    return { error: false, token: token }
  } catch (error) {
    return { error: true }
  }
}
