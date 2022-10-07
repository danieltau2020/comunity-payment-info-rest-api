import express from "express"
import { cleanBody } from "../middlewares/cleanbody.js"
import { validateToken } from "../middlewares/validateToken.js"
import {
  signUp,
  login,
  activateAccount,
  forgotPassword,
  resetPassword,
  referredAccounts,
  logout,
  refreshToken
} from "../controllers/usersController.js"

const router = express.Router()

router.route("/signup").post(cleanBody, signUp)
router.route("/login").post(cleanBody, login)
router.route("/activate").patch(cleanBody, activateAccount)
router.route("/forgot").patch(cleanBody, forgotPassword)
router.route("/reset").patch(cleanBody, resetPassword)
router.route("/referred").get(cleanBody, validateToken, referredAccounts)
router.route("/logout").get(cleanBody, validateToken, logout)
router.route("/refresh").post(cleanBody, refreshToken)

export default router
