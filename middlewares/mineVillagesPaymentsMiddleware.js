import MineVillagesPaymentModel from "../models/MineVillagesPaymentModel.js"

export const findHouseholdPaymentNext = async (req, res, next) => {
  try {
    const { villageId, dwellingNo, householdNo } = req.query

    const payment = await MineVillagesPaymentModel.find({
      villageId: Number(villageId),
      dwellingNo: Number(dwellingNo),
      householdNo: Number(householdNo)
    }).lean()

    req.paymentMineVillages = payment

    next()
  } catch (error) {
    console.error("Error-get-minevillage-household-payment", error)
    req.payment = {}
    next()
  }
}
