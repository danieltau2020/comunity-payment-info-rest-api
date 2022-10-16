import express from "express"
import {
  createCmcaPeopleCollection,
  createCmcaBankAccountsCollection,
  createMineVillagesPeopleCollection,
  createMineVillagesBankAccountsCollection,
  deleteCmcaPeopleCollection,
  deleteCmcaBankAccountsCollection,
  deleteMineVillagePeopleCollection,
  deleteMineVillagesBankAccountsCollection,
  createCmcaPaymentsCollection,
  createMineVillagesSmlPaymentsCollection,
  createMineVillagesLeasePaymentsCollection,
  updateCmcaPaymentType,
  updateHeduruClanBankAccountDetails
} from "../db/dbControllers.js"

const router = express.Router()

router
  .route("/cmcapeople")
  .post(createCmcaPeopleCollection)
  .delete(deleteCmcaPeopleCollection)
router
  .route("/cmcabankaccounts")
  .post(createCmcaBankAccountsCollection)
  .delete(deleteCmcaBankAccountsCollection)
router
  .route("/cmcapayments")
  .post(createCmcaPaymentsCollection)
  .put(updateCmcaPaymentType)
router
  .route("/minevillagepeople")
  .post(createMineVillagesPeopleCollection)
  .delete(deleteMineVillagePeopleCollection)
router
  .route("/minevillagebankaccounts")
  .post(createMineVillagesBankAccountsCollection)
  .delete(deleteMineVillagesBankAccountsCollection)
router
  .route("/minevilagesmlpayments")
  .post(createMineVillagesSmlPaymentsCollection)
router
  .route("/minevilageleasepayments")
  .post(createMineVillagesLeasePaymentsCollection)
router.route("/heduruclanbankaccounts").put(updateHeduruClanBankAccountDetails)

export default router
