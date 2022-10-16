import HeduruClanModel from "../models/HeduruClanModel.js"
import HeduruClanVillageModel from "../models/HeduruClanVillageModel.js"

const findVillage = async (villageId) => {
  try {
    const village = await HeduruClanVillageModel.findOne({
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

const checkAccountQuery = (accountName, accountNumber, bank) => {
  if (accountName !== "" || accountNumber !== "" || bank !== "") {
    return true
  }
  return false
}

export const findAllHeduruClanNext = async (req, res, next) => {
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

    const regionId = Number(req.query.regionId)
    const villageId = Number(req.query.villageId)
    const page = Number(req.query.page) + 1
    const limit = Number(req.query.limit)

    const clanNameSearch = req.query.clanName
      ? { clanName: { $regex: req.query.clanName, $options: "i" } }
      : {}

    let query = []

    if (Object.keys(clanNameSearch).length > 0) {
      query.push(clanNameSearch)
    }

    let data = []
    let clans = []
    let count = 0

    // Yes region and village
    if (regionId && villageId) {
      // No clan query
      if (!query.length > 0) {
        req.clanQuery = false

        data = await HeduruClanModel.find({
          regionId: regionId,
          villageId: villageId
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanModel.find({
          regionId: regionId,
          villageId: villageId
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          clans.push(obj)
        }

        req.clans = clans
        req.totalCount = +count

        return next()
      }
      //yes clan query
      else {
        req.clanQuery = true

        data = await HeduruClanModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          clans.push(obj)
        }

        req.clans = clans
        req.totalCount = +count

        return next()
      }
    }
    // Only region
    else {
      // No clan query
      if (!query.length > 0) {
        req.clanQuery = false

        data = await HeduruClanModel.find({
          regionId: regionId
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanModel.find({
          regionId: regionId
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          clans.push(obj)
        }

        req.clans = clans
        req.totalCount = +count

        return next()
      }
      // Yes clan query
      else {
        req.clanQuery = true

        data = await HeduruClanModel.find({
          regionId: regionId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanModel.find({
          regionId: regionId,
          $and: query
        }).countDocuments()

        for (let item of data) {
          let obj = {
            villageName: await findVillage(item.villageId),
            ...item
          }
          clans.push(obj)
        }

        req.clans = clans
        req.totalCount = +count

        return next()
      }
    }
  } catch (error) {
    console.error("Error can't get heduru clans", error)
    req.clans = []
    req.totalCount = 0
    next()
  }
}

export const findClanNext = async (req, res, next) => {
  try {
    const { clanId } = req.query

    const clan = await HeduruClanModel.findOne({
      clanId: Number(clanId)
    }).lean()

    req.clan = clan

    next()
  } catch (error) {
    console.error("Error can't get heduru clan", error)
    req.clan = {}
    next()
  }
}
