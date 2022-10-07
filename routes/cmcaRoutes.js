import express from "express"
import { validateToken } from "../middlewares/validateToken.js"
import { cleanBody } from "../middlewares/cleanbody.js"
import { findAll, findHousehold } from "../controllers/cmcaPeopleControllers.js"
import {
  findAllPeopleNext,
  findHouseholdNext
} from "../middlewares/cmcaPeopleMiddleware.js"
import {
  findAllBankAccountsNext,
  findHouseholdAccountNext
} from "../middlewares/cmcaBankAccountsMiddleware.js"
import { findHouseholdPaymentNext } from "../middlewares/cmcaPaymentsMiddleware.js"
import { findHouseholdPaymentNext as findMineVillagePaymentNext } from "../middlewares/mineVillagesPaymentsMiddleware.js"

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
    findMineVillagePaymentNext,
    findHousehold
  )

export default router
