import express from "express"
import { validateToken } from "../middlewares/validateToken.js"
import { cleanBody } from "../middlewares/cleanbody.js"
import { addEmployee } from "../controllers/employeesController.js"

const router = express.Router()

router.route("/addemployee").post(cleanBody, validateToken, addEmployee)

export default router
