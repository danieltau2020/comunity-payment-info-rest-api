import express from "express"
import { validateToken } from "../middlewares/validateToken.js"
import { cleanBody } from "../middlewares/cleanbody.js"
import {
  findAll,
  findHousehold
} from "../controllers/mineVillagesPeopleControllers.js"
import {
  findAllPeopleNext,
  findHouseholdNext
} from "../middlewares/mineVillagesPeopleMiddleware.js"
import {
  findAllBankAccountsNext,
  findHouseholdAccountNext
} from "../middlewares/mineVillagesBankAccounstMiddleware.js"
import { findHouseholdPaymentNext } from "../middlewares/mineVillagesPaymentsMiddleware.js"

const router = express.Router()

router
  .route("/people")
  .get(
    cleanBody,
    validateToken,
    findAllPeopleNext,
    findAllBankAccountsNext,
    findAll
  )

router
  .route("/household")
  .get(
    cleanBody,
    validateToken,
    findHouseholdNext,
    findHouseholdAccountNext,
    findHouseholdPaymentNext,
    findHousehold
  )

export default router
