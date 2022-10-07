import jwt from "jsonwebtoken"
import UsersModel from "../models/UsersModel.js"

export const validateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  let result

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing"
    })
  }

  const token = req.headers.authorization.split(" ")[1] // Bearer token
  const options = {
    expiresIn: "30s"
  }

  try {
    let user = await UsersModel.findOne({
      accessToken: token
    })

    if (!user) {
      result = {
        error: true,
        message: "Authorization error"
      }
      return res.status(403).json(result)
    }

    result = jwt.verify(token, process.env.JWT_SECRET, options)

    if (!user.userId === result.id) {
      result = {
        error: true,
        message: "Invalid token"
      }
      return res.status(401).json(result)
    }

    result["referralCode"] = user.referralCode

    req.decoded = result

    next()
  } catch (error) {
    console.error(error)

    if (error.name === "TokenExpiredError") {
      result = {
        error: true,
        message: "Token expired"
      }
    } else {
      result = {
        error: true,
        message: "Authentication error"
      }
    }
    return res.status(403).json(result)
  }
}
