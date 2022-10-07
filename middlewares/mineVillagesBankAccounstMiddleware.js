import MineVillagesBankAccounstModel from "../models/MineVillagesBankAccountsModel.js"
import MineVilagesPeopleModel from "../models/MineVillagesPeopleModel.js"
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

export const findAllBankAccountsNext = async (req, res, next) => {
  try {
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

    // Yes account query
    if (req.accountQuery) {
      // Yes village
      if (villageId) {
        account = await MineVillagesBankAccounstModel.find({
          villageId: villageId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await MineVillagesBankAccounstModel.find({
          villageId: villageId,
          $and: query
        }).countDocuments()

        if (account.length > 0) {
          for (let item of account) {
            const obj = await MineVilagesPeopleModel.findOne({
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
      // No village
      else {
        req.people = []
        req.totalCount = 0
        return next()
      }
    }
    // No account query
    else {
      // No people query
      if (!req.peopleQuery && req.people.length > 0) {
        for (let item of req.people) {
          if (item.relationship === "Head") {
            const obj = await MineVillagesBankAccounstModel.findOne({
              villageId: item.villageId,
              dwellingNo: item.dwellingNo,
              householdNo: item.householdNo
            }).lean()

            people.push({
              ...item,
              ...obj
            })
            continue
          }
          people.push({
            ...item
          })
        }

        req.people = people
        return next()
      }

      // Yes people query
      if (req.peopleQuery && req.people.length > 0) {
        for (let item of req.people) {
          const obj = await MineVillagesBankAccounstModel.findOne({
            villageId: item.villageId,
            dwellingNo: item.dwellingNo,
            householdNo: item.householdNo
          }).lean()

          account.push(obj)
        }

        for (let item of req.people) {
          const obj = account.filter(
            (acc) =>
              acc.villageId === item.villageId &&
              acc.dwellingNo === item.dwellingNo &&
              acc.householdNo === item.householdNo
          )[0]
          people.push({
            ...item,
            ...obj
          })
        }

        req.people = people
        return next()
      }

      // No people found therefore no account
      req.people = []
      req.totalCount = 0
      return next()
    }
  } catch (error) {
    console.error("Error-get-minevillages-bankaccounts", error)
    req.people = []
    req.totalCount = 0
    next()
  }
}

export const findHouseholdAccountNext = async (req, res, next) => {
  try {
    const { villageId, dwellingNo, householdNo } = req.query

    const account = await MineVillagesBankAccounstModel.findOne({
      villageId: Number(villageId),
      dwellingNo: Number(dwellingNo),
      householdNo: Number(householdNo)
    }).lean()

    req.account = account

    next()
  } catch (error) {
    console.error("Error-get-mine-village-household-bankaccount", error)
    req.account = {}
    next()
  }
}
