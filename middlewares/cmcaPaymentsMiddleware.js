import CmcaPaymentModel from "../models/CmcaPaymentModel.js"

export const findHouseholdPaymentNext = async (req, res, next) => {
  try {
    const { villageId, dwellingNo, householdNo } = req.query

    const payment = await CmcaPaymentModel.find({
      villageId: Number(villageId),
      dwellingNo: Number(dwellingNo),
      householdNo: Number(householdNo)
    }).lean()

    req.payment = payment

    next()
  } catch (error) {
    console.error("Error-get-cmca-household-payment", error)
    req.payment = {}
    next()
  }
}
