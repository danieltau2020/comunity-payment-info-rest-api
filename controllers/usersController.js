import Joi from "joi"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { customAlphabet as generate } from "nanoid"
import { sendEmail } from "../utils/mailer.js"
import { generateJwt, generateRefreshJwt } from "../utils/generateJwt.js"
import UsersModel from "../models/UsersModel.js"
import EmployeesModel from "../models/EmpoyeesModel.js"

const CHARACTER_SET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const REFERRAL_CODE_LENGTH = 8

const referralCode = generate(CHARACTER_SET, REFERRAL_CODE_LENGTH)

// Validate user schema
const usersSchema = Joi.object().keys({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),
  password: Joi.string().required().min(4).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  referrer: Joi.string()
})

// Signup
export const signUp = async (req, res) => {
  try {
    const result = usersSchema.validate(req.body)

    if (result.error) {
      console.error(result.error.message)
      return res.json({
        error: true,
        status: 422,
        message: "Invalid details"
      })
    }

    // Check if email exists
    const user = await UsersModel.findOne({ email: result.value.email })

    if (user) {
      return res.status(400).json({
        error: true,
        message: "Email is already in use"
      })
    }

    // Check if employee exists
    const employee = await EmployeesModel.findOne({ email: result.value.email })

    if (!employee) {
      return res.status(400).json({
        error: true,
        message: "Unauthorized user"
      })
    }

    const hash = await UsersModel.hashPassword(result.value.password)

    const id = uuid() // Generate unique id for the user
    result.value.userId = id

    // Remove confirm password field from the result as we don't need to save this in the db
    delete result.value.confirmPassword
    result.value.password = hash

    let code = Math.floor(100000 + Math.random() * 900000) // Generate random 6 digit code
    let expiry = Date.now() + 60 * 1000 * 10 // Set expiry 10 mins ahead of now

    const emailSubject = "User Account Activation"
    const emailBody = `<!DOCTYPE>
    <html>
        <body>
            <p>Your activation code is: <b>${code}</b></p>
            <p>Click on this <a href="http://localhost:3000/?id=activate" target="_blank">link</a> to activate your account.</p>
            <p>The activation code will expire after 10 minutes.</p>
            <p>Thank you</p>
            <p>Community & Payment Info App</p>
        </body>
    </html>
    `

    const sendCode = await sendEmail(
      result.value.email,
      emailSubject,
      emailBody
    )

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email"
      })
    }
    result.value.emailToken = code
    result.value.emailTokenExpires = new Date(expiry)

    // Check if referred and validate code
    if (result.value.hasOwnProperty("referrer")) {
      let referrer = await UsersModel.findOne({
        referralCode: result.value.referrer
      })

      if (!referrer) {
        return res.status(400).json({
          error: true,
          message: "Invalid referral code"
        })
      }
    }

    result.value.referralCode = referralCode()
    const newUser = new UsersModel(result.value)
    await newUser.save()

    return res.status(200).json({
      success: true,
      message:
        "Your registration is successful. Check your email to activate your account. The link will expire after 10 minutes."
      // referralCode: result.value.referralCode
    })
  } catch (error) {
    console.error("Signup-error", error)
    return res.status(500).json({
      error: true,
      message: "Cannot register"
    })
  }
}

// Activate
export const activateAccount = async (req, res) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        error: true,
        message: "Please make a valid request"
      })
    }

    const user = await UsersModel.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() } // Check if the code has expired
    })

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details or the code has expired!"
      })
    } else {
      if (user.active) {
        return res.status(400).json({
          error: true,
          message: "Account already activated"
        })
      }

      user.emailToken = ""
      user.emailTokenExpires = null
      user.active = true

      await user.save()

      return res.status(200).json({
        success: true,
        message: "Account activated"
      })
    }
  } catch (error) {
    console.error("Activation-error", error)
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials"
      })
    }

    // Find if account with the email exists in DB
    const user = await UsersModel.findOne({ email: email })

    // Not found - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found"
      })
    }

    // Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "Please check your email to activate your account"
      })
    }

    const employee = await EmployeesModel.findOne({ email: user.email })
      .select(["email", "firstName", "lastName"])
      .lean()

    // Verify the password is valid
    const isValid = await UsersModel.comparePasswords(password, user.password)

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials"
      })
    }

    /**********************************/
    // Generate access token & refresh token
    const accessToken = await generateJwt(user.userId, employee)
    const refreshToken = await generateRefreshJwt(user.userId.replace)

    if (accessToken.error || refreshToken.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later."
      })
    }
    user.accessToken = accessToken.token
    user.refreshToken = refreshToken.token

    /**********************************/

    await user.save()

    // Success
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token
      }
      // accessToken: accessToken.token, // Send it to client
      // refreshToken: refreshToken.token
    })
  } catch (error) {
    console.error("Login error", err)
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later."
    })
  }
}

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Please provide your email"
      })
    }

    const user = await UsersModel.findOne({
      email: email
    })

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "You will recieve an email to reset your password"
      })
    }

    let code = Math.floor(100000 + Math.random() * 900000) // Generate random 6 digit code

    const emailSubject = "User Password Reset"
    const emailBody = `<!DOCTYPE>
    <html>
        <body>
            <p>Your password reset code is: <b>${code}</b></p>
            <p>Click on this <a href="http://localhost:3000/?id=reset" target="_blank">link</a> reset your password.</p>
            <p>The reset link will expire after 10 minutes.</p>
            <p>Thank you</p>
            <p>Community & Payment Info App</p>
        </body>
    </html>
    `

    let response = await sendEmail(user.email, emailSubject, emailBody)

    if (response.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send email. Please try again later."
      })
    }

    let expiry = Date.now() + 60 * 1000 * 10
    user.resetPasswordToken = code
    user.resetPasswordExpires = expiry

    await user.save()

    return res.status(200).json({
      success: true,
      message: "You will recieve an email to reset your password"
    })
  } catch (error) {
    console.error("Forgot-password-error", error)
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message: "Couldn't process request. Please provide all details."
      })
    }

    const user = await UsersModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Password reset token is invalid or expired"
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Password didn't match."
      })
    }

    const hash = await UsersModel.hashPassword(newPassword)
    user.password = hash
    user.resetPasswordToken = null
    user.resetPasswordExpires = ""

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully"
    })
  } catch (error) {
    console.error("Reset-password-error", error)
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

// Referred accounts
export const referredAccounts = async (req, res) => {
  try {
    const { referralCode } = req.decoded

    const referredAccounts = await UsersModel.find(
      { referrer: referralCode },
      { email: 1, referralCode: 1, _id: 0 }
    )

    res.status(200).json({
      success: true,
      accounts: referredAccounts,
      total: referredAccounts.length
    })
  } catch (error) {
    console.error("Fetch-referred-error", error)

    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

// Logout
export const logout = async (req, res) => {
  try {
    const { id } = req.decoded

    let user = await UsersModel.findOne({ userId: id })

    user.accessToken = ""
    user.refreshToken = ""

    await user.save()

    return res.status(200).json({ success: true, message: "User logged out" })
  } catch (error) {
    console.log(error)
    console.error("User-logout-error", error)

    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token

    if (!refreshToken)
      return res
        .status(401)
        .json({ error: true, message: "User not authenticated" })

    const user = await UsersModel.findOne({ refreshToken: refreshToken })

    if (!user) {
      return res.status(403).json({ error: true, message: "Invalid token" })
    }

    const employee = await EmployeesModel.findOne({ email: user.email })
      .select(["email", "firstName", "lastName"])
      .lean()

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decode) => {
        if (err) {
          console.error("Refresh token verification failed", err)
          return res
            .status(401)
            .json({ error: true, message: "Refresh token verification failed" })
        }

        const newAccessToken = await generateJwt(user.userId, employee)
        const newRefreshToken = await generateRefreshJwt(user.userId)

        user.accessToken = newAccessToken.token
        user.refreshToken = newRefreshToken.token

        await user.save()

        res.status(200).json({
          user: {
            accessToken: newAccessToken.token,
            refreshToken: newRefreshToken.token
          }
        })
      }
    )
  } catch (error) {
    console.error("Refresh-token-error", error)

    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}
