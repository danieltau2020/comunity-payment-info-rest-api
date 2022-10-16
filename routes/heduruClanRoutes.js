import express from "express"
import {
  findAllHeduruClan,
  findHeduruClan
} from "../controllers/heduruClansController.js"
import {
  findAllHeduruClanNext,
  findClanNext
} from "../middlewares/heduruClansMiddleware.js"
import {
  findAllHeduruClanBankAccountsNext,
  findHeduruClanAccountNext
} from "../middlewares/heduruClanBankAccountsMiddleware.js"

const router = express.Router()

router
  .route("/clans")
  .get(
    findAllHeduruClanNext,
    findAllHeduruClanBankAccountsNext,
    findAllHeduruClan
  )

router
  .route("/clan")
  .get(findClanNext, findHeduruClanAccountNext, findHeduruClan)

export default router
