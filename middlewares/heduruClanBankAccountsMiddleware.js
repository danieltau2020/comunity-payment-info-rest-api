import HeduruClanModel from "../models/HeduruClanModel.js"
import HeduruClanVillageModel from "../models/HeduruClanVillageModel.js"
import HeduruClanBankAccountModel from "../models/HeduruClanBankAccountModel.js"

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

export const findAllHeduruClanBankAccountsNext = async (req, res, next) => {
  try {
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

    let clans = []
    let account = []
    let count = 0

    // Yes account query
    if (req.accountQuery) {
      // Yes region and village
      if (regionId && villageId) {
        account = await HeduruClanBankAccountModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanBankAccountModel.find({
          regionId: regionId,
          villageId: villageId,
          $and: query
        }).countDocuments()

        if (account.length > 0) {
          for (let item of account) {
            const obj = await HeduruClanModel.findOne({
              clanId: item.clanId
            }).lean()

            const villageName = await findVillage(item.villageId)

            if (obj) {
              clans.push({
                ...item,
                ...obj,
                villageName: villageName
              })
            }
          }

          req.clans = clans
          req.totalCount = +count
          return next()
        } else {
          req.clans = []
          req.totalCount = 0
          return next()
        }
      }
      // Only region
      else {
        account = await HeduruClanBankAccountModel.find({
          regionId: regionId,
          $and: query
        })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean()

        count = await HeduruClanBankAccountModel.find({
          regionId: regionId,
          $and: query
        }).countDocuments()

        if (account.length > 0) {
          for (let item of account) {
            const obj = await HeduruClanModel.findOne({
              clanId: item.clanId
            }).lean()

            const villageName = await findVillage(item.villageId)

            if (obj) {
              clans.push({
                ...item,
                ...obj,
                villageName: villageName
              })
            }
          }

          req.clans = clans
          req.totalCount = +count
          return next()
        } else {
          req.clans = []
          req.totalCount = 0
          return next()
        }
      }
    }
    //  No account query
    else {
      if (req.clans.length > 0) {
        for (let item of req.clans) {
          const obj = await HeduruClanBankAccountModel.findOne({
            clanId: item.clanId
          }).lean()

          clans.push({
            ...item,
            ...obj
          })
        }

        req.clans = clans
        return next()
      } else {
        req.clans = []
        req.totalCount = 0
        return next()
      }
    }
  } catch (error) {
    console.error("Error can't get heduru clan bank accounts", error)
    req.clans = []
    req.totalCount = 0
    next()
  }
}

export const findHeduruClanAccountNext = async (req, res, next) => {
  try {
    const { clanId } = req.query

    const account = await HeduruClanBankAccountModel.findOne({
      clanId: Number(clanId)
    }).lean()

    req.account = account

    next()
  } catch (error) {
    console.error("Error can't get heduru clan bank account", error)
    req.account = {}
    next()
  }
}
