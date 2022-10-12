import CmcaPaymentModel from "../models/CmcaPaymentModel.js"
import CmcaPeopleModel from "../models/CmcaPeopleModel.js"
import VillageModel from "../models/VillageModel.js"

const findVillage = async (villageId) => {
  try {
    const village = await VillageModel.findOne({ villageId: villageId })
      .select("villageName")
      .lean()
    return village.villageName
  } catch (error) {
    console.error("Error-finding-village", error)
    return ""
  }
}

const findVillageByRegion = async (regionId, villageId) => {
  try {
    const village = await VillageModel.findOne({
      regionId: regionId,
      villageId: villageId
    })
      .select("villageName")
      .lean()
    return village.villageName
  } catch (error) {
    console.error("Error-finding-village", error)
    return ""
  }
}

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

export const findPaymentAccountNext = async (req, res, next) => {
  try {
    let tempPeople = []
    tempPeople = req.people

    const regionId = Number(req.query.regionId)
    const villageId = Number(req.query.villageId)
    const page = Number(req.query.page) + 1
    const limit = Number(req.query.limit)

    const accountNameSearch = req.query.accountName
      ? { accountName: { $regex: req.query.accountName, $options: "i" } }
      : {}

    const accountNumberSearch = req.query.accountNumber
      ? { accountNumber: { $regex: req.query.accountNumber, $options: "i" } }
      : {}

    const bankSearch = req.query.bank
      ? { bank: { $regex: req.query.bank, $options: "i" } }
      : {}

    const dwellingNoSearch =
      req.query.dwellingNo && req.query.dwellingNo !== ""
        ? { dwellingNo: Number(req.query.dwellingNo) }
        : {}

    const householdNoSearch =
      req.query.dwellingNo && req.query.householdNo !== ""
        ? { householdNo: Number(req.query.householdNo) }
        : {}

    let query = []

    if (Object.keys(accountNameSearch).length > 0) {
      query.push(accountNameSearch)
    }
    if (Object.keys(accountNumberSearch).length > 0) {
      query.push(accountNumberSearch)
    }
    if (Object.keys(bankSearch).length > 0) {
      query.push(bankSearch)
    }
    if (Object.keys(dwellingNoSearch).length > 0) {
      query.push(dwellingNoSearch)
    }
    if (Object.keys(householdNoSearch).length > 0) {
      query.push(householdNoSearch)
    }

    let people = []
    let account = []
    let count = 0

    if (!tempPeople.length > 0 && req.accountQuery) {
      // Yes region and village
      if (regionId && villageId) {
        account = await CmcaPaymentModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await CmcaPaymentModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        }).countDocuments()

        if (account.length > 0) {
          for (let item of account) {
            const obj = await CmcaPeopleModel.findOne({
              regionId: item.regionId,
              villageId: item.villageId,
              dwellingNo: item.dwellingNo,
              householdNo: item.householdNo,
              relationship: "Head"
            }).lean()

            const villageName = await findVillage(item.villageId)

            if (obj) {
              people.push({
                ...item,
                ...obj,
                villageName: villageName
              })
            }
          }

          req.people = people
          req.totalCount = +count
          return next()
        } else {
          req.people = []
          req.totalCount = 0
          return next()
        }
      }
      // Only region
      else {
        account = await CmcaPaymentModel.find({
          regionId: regionId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await CmcaPaymentModel.find({
          regionId: regionId,
          $and: query
        }).countDocuments()

        if (account.length > 0) {
          for (let item of account) {
            const obj = await CmcaPeopleModel.findOne({
              villageId: item.villageId,
              dwellingNo: item.dwellingNo,
              householdNo: item.householdNo,
              relationship: "Head"
            }).lean()

            const villageName = await findVillageByRegion(
              item.regionId,
              item.villageId
            )

            if (obj) {
              people.push({
                ...item,
                ...obj,
                villageName: villageName
              })
            }
          }

          req.people = people
          req.totalCount = +count
          return next()
        } else {
          req.people = []
          req.totalCount = 0
          return next()
        }
      }
    } else {
      return next()
    }
  } catch (error) {
    console.error("Error-get-cmca-payment-account", error)
    req.payment = {}
    next()
  }
}
