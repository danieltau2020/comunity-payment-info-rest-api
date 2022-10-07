import MineVillagesPeopleModel from "../models/MineVillagesPeopleModel.js"
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

const checkAccountQuery = (accountName, accountNumber, bank) => {
  if (accountName !== "" || accountNumber !== "" || bank !== "") {
    return true
  }
  return false
}

export const findAllPeopleNext = async (req, res, next) => {
  try {
    const { accountName, accountNumber, bank } = req.query

    // Yes account query
    if (checkAccountQuery(accountName, accountNumber, bank)) {
      req.people = []
      req.totalCount = 0
      req.accountQuery = true
      return next()
    }

    req.accountQuery = false

    const villageId = Number(req.query.villageId)
    const page = Number(req.query.page) + 1
    const limit = Number(req.query.limit)

    const firstNameSearch = req.query.firstName
      ? { firstName: { $regex: req.query.firstName, $options: "i" } }
      : {}

    const lastNameSearch = req.query.lastName
      ? { lastName: { $regex: req.query.lastName, $options: "i" } }
      : {}

    const dwellingNoSearch =
      req.query.dwellingNo && req.query.dwellingNo !== ""
        ? { dwellingNo: Number(req.query.dwellingNo) }
        : {}

    const householdNoSearch =
      req.query.householdNo && req.query.householdNo !== ""
        ? { householdNo: Number(req.query.householdNo) }
        : {}

    let query = []

    if (Object.keys(firstNameSearch).length > 0) {
      query.push(firstNameSearch)
    }
    if (Object.keys(lastNameSearch).length > 0) {
      query.push(lastNameSearch)
    }
    if (Object.keys(dwellingNoSearch).length > 0) {
      query.push(dwellingNoSearch)
    }
    if (Object.keys(householdNoSearch).length > 0) {
      query.push(householdNoSearch)
    }

    let data = []
    let people = []
    let count = 0

    // Yes village
    if (villageId) {
      // No people query
      if (!query.length > 0) {
        req.peopleQuery = false

        data = await MineVillagesPeopleModel.find({
          villageId: villageId
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await MineVillagesPeopleModel.find({
          villageId: villageId
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          people.push(obj)
        }

        req.people = people
        req.totalCount = +count

        return next()
      }
      // Yes people query
      else {
        req.peopleQuery = true

        data = await MineVillagesPeopleModel.find({
          villageId: villageId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await MineVillagesPeopleModel.find({
          villageId: villageId,
          $and: query
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          people.push(obj)
        }

        req.people = people
        req.totalCount = +count

        return next()
      }
    }

    // No village
    req.people = []
    req.totalCount = 0

    return next()
  } catch (error) {
    console.error("Error-get-minevillages-people", error)
    req.people = []
    req.totalCount = 0
    next()
  }
}

export const joinPeopleBankAccounts = async (req, res, next) => {
  try {
  } catch (error) {
    console.error("Error-joining-people-bankaccounts", error)
    req.people = []
    req.totalCount = 0
    next()
  }
}

export const findHouseholdNext = async (req, res, next) => {
  try {
    const { villageId, dwellingNo, householdNo } = req.query

    const people = await MineVillagesPeopleModel.find({
      villageId: Number(villageId),
      dwellingNo: Number(dwellingNo),
      householdNo: Number(householdNo)
    }).lean()

    req.people = people

    next()
  } catch (error) {
    console.error("Error-get-mine-village-household", error)
    req.people = []
    next()
  }
}
