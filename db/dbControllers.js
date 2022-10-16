import { v4 as uuid } from "uuid"
import TempPeopleModel from "../tempModels/TempPeopleModel.js"
import TempAccountModel from "../tempModels/TempAccountModel.js"
import CmcaPeopleModel from "../models/CmcaPeopleModel.js"
import CmcaBankAccountsModel from "../models/CmcaBankAccountsModel.js"
import MineVilagesPeopleModel from "../models/MineVillagesPeopleModel.js"
import MineVillagesBankAccountsModel from "../models/MineVillagesBankAccountsModel.js"
import TempPaymentModel from "../tempModels/TempPaymentModel.js"
import CmcaPaymentModel from "../models/CmcaPaymentModel.js"
import MineVillagesPaymentModel from "../models/MineVillagesPaymentModel.js"
import RegionModel from "../models/RegionModel.js"
import VillageModel from "../models/VillageModel.js"
import HeduruClanModel from "../models/HeduruClanModel.js"
import HeduruClanBankAccountModel from "../models/HeduruClanBankAccountModel.js"

const findVillage = async (villageName) => {
  try {
    const village = await VillageModel.findOne({ villageName: villageName })
      .select("villageId")
      .lean()
    return village.villageId
  } catch (error) {
    console.error("Error-finding-village", error)
    return ""
  }
}

const findRegion = async (regionName) => {
  try {
    const region = await RegionModel.findOne({ regionName: regionName })
      .select("regionId")
      .lean()
    return region.regionId
  } catch (error) {
    console.error("Error-finding-region", error)
    return ""
  }
}

const findRegionByVillage = async (villageName) => {
  try {
    const village = await VillageModel.findOne({
      villageName: villageName
    }).lean()

    const region = await RegionModel.findOne({ regionId: village.regionId })
      .select("regionId")
      .lean()
    return region.regionId
  } catch (error) {
    console.error("Error-finding-region", error)
    return ""
  }
}

// @desc    Creating people collection
export const createCmcaPeopleCollection = async (req, res) => {
  try {
    const tempPeople = await TempPeopleModel.find().lean()

    if (!tempPeople) {
      return res
        .status(400)
        .json({ error: true, message: "No records found in people collection" })
    }

    await CmcaPeopleModel.insertMany(tempPeople)
      .then(() => {
        res
          .status(200)
          .json({ success: true, message: "Cmca people collection created" })
      })
      .catch(() => {
        return res.status(500).json({
          error: true,
          message: "Error, unable to create cmca people collection"
        })
      })
  } catch (error) {
    console.error("Error-create-collection", error)
    return res
      .status(500)
      .json({ error: true, message: "Error creating cmca people colletion" })
  }
}

export const createMineVillagesPeopleCollection = async (req, res) => {
  try {
    const tempPeople = await TempPeopleModel.find().lean()

    if (!tempPeople) {
      return res
        .status(400)
        .json({ error: true, message: "No records found in people collection" })
    }

    await MineVilagesPeopleModel.insertMany(tempPeople)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Mine villages people collection created"
        })
      })
      .catch(() => {
        console.error("Error-create-collection", error)

        return res.status(500).json({
          error: true,
          message: "Error, unable to create mine villages people collection"
        })
      })
  } catch (error) {
    console.error("Error-create-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error creating mine villages people colletion"
    })
  }
}

// @desc    Creating bank account collection
export const createCmcaBankAccountsCollection = async (req, res) => {
  try {
    const tempAccount = await TempAccountModel.find().lean()

    if (!tempAccount) {
      return res.status(400).json({
        error: true,
        message: "No records found in account collection"
      })
    }

    await CmcaBankAccountsModel.insertMany(tempAccount)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Cmca bank accounts collection created"
        })
      })
      .catch(() => {
        console.error("Error-create-collection", error)

        return res.status(500).json({
          error: true,
          message: "Error, unable to create cmca bank accounts collection"
        })
      })
  } catch (error) {
    console.error("Error-create-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error creating cmca bank accounts colletion"
    })
  }
}

export const createMineVillagesBankAccountsCollection = async (req, res) => {
  try {
    const tempAccount = await TempAccountModel.find().lean()

    if (!tempAccount) {
      return res.status(400).json({
        error: true,
        message: "No records found in account collection"
      })
    }

    await MineVillagesBankAccountsModel.insertMany(tempAccount)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Mine villages bank accounts collection created"
        })
      })
      .catch(() => {
        console.error("Error-create-collection", error)

        return res.status(500).json({
          error: true,
          message:
            "Error, unable to create mine villages bank accounts collection"
        })
      })
  } catch (error) {
    console.error("Error-create-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error creating mine villages bank accounts colletion"
    })
  }
}

// @desc    Delete people collection
export const deleteCmcaPeopleCollection = async (req, res) => {
  try {
    await CmcaPeopleModel.deleteMany()
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Cmca people collection deleted"
        })
      })
      .catch(() => {
        console.error("Error-delete-collection", error)

        return res.status(500).json({
          error: true,
          message: "Error, unable to delete cmca people collection"
        })
      })
  } catch (error) {
    console.error("Error-delete-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error, unable to delete cmca people collection"
    })
  }
}

export const deleteMineVillagePeopleCollection = async (req, res) => {
  try {
    await MineVilagesPeopleModel.deleteMany()
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Mine villages people collection deleted"
        })
      })
      .catch(() => {
        console.error("Error-delete-collection", error)

        return res.status(500).json({
          error: true,
          message: "Error, unable to delete mine villages people collection"
        })
      })
  } catch (error) {
    console.error("Error-delete-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error, unable to delete mine villages people collection"
    })
  }
}

// @desc    Delete bank account collection
export const deleteCmcaBankAccountsCollection = async (req, res) => {
  try {
    await CmcaBankAccountsModel.deleteMany()
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Cmca bank accounts collection deleted"
        })
      })
      .catch(() => {
        console.error("Error-delete-collection", error)

        return res.status(500).json({
          error: true,
          message: "Error, unable to delete cmca bank accounts collection"
        })
      })
  } catch (error) {
    console.error("Error-delete-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error, unable to delete cmca bank accounts collection"
    })
  }
}

export const deleteMineVillagesBankAccountsCollection = async (req, res) => {
  try {
    await MineVillagesBankAccountsModel.deleteMany()
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Mine villages bank accounts collection deleted"
        })
      })
      .catch(() => {
        console.error("Error-delete-collection", error)

        return res.status(500).json({
          error: true,
          message:
            "Error, unable to delete mine villages bank accounts collection"
        })
      })
  } catch (error) {
    console.error("Error-delete-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error, unable to delete mine villages bank accounts collection"
    })
  }
}

// @desc    Creating cmca payment collection
export const createCmcaPaymentsCollection = async (req, res) => {
  try {
    const tempPayment = await TempPaymentModel.find().lean()

    if (!tempPayment) {
      return res.status(400).json({
        error: true,
        message: "No records found in temp payment collection"
      })
    }

    for (let item of tempPayment) {
      const cmcaPayment = new CmcaPaymentModel()
      const id = uuid() // Generate unique id for the payment

      cmcaPayment.paymentId = id
      cmcaPayment.regionId = await findRegion(item.regionId.trim())
      cmcaPayment.villageId = await findVillage(item.villageId.trim())
      cmcaPayment.dwellingNo = item.dwellingNo
      cmcaPayment.householdNo = item.householdNo
      cmcaPayment.year = 2022
      cmcaPayment.date = new Date("2022-09-23")
      cmcaPayment.desc = "CMCA payment first batch"
      cmcaPayment.batch = 1
      cmcaPayment.amount = item.amount.trim()
      cmcaPayment.accountName = item.accountName.trim()
      cmcaPayment.accountNumber = item.accountNumber.trim()
      cmcaPayment.bank = item.bank.trim()
      cmcaPayment.status = "Approved"

      await cmcaPayment.save()
    }

    res.status(200).json({
      success: true,
      message: "CMCA payment collection created successfully"
    })
  } catch (error) {
    console.error("Error-create-cmca-payment-collection", error)
    return res
      .status(500)
      .json({ error: true, message: "Error creating cmca payment collection" })
  }
}

// @desc    Creating mine villages sml payment collection
export const createMineVillagesSmlPaymentsCollection = async (req, res) => {
  try {
    const tempPayment = await TempPaymentModel.find().lean()

    if (!tempPayment) {
      return res.status(400).json({
        error: true,
        message: "No records found in temp payment collection"
      })
    }

    for (let item of tempPayment) {
      const mineVillagesPayment = new MineVillagesPaymentModel()
      const id = uuid() // Generate unique id for the payment

      mineVillagesPayment.paymentId = id
      mineVillagesPayment.regionId = await findRegionByVillage(
        item.villageId.trim()
      )
      mineVillagesPayment.villageId = await findVillage(item.villageId.trim())
      mineVillagesPayment.dwellingNo = item.dwellingNo
      mineVillagesPayment.householdNo = item.householdNo
      mineVillagesPayment.year = 2022
      mineVillagesPayment.date = new Date("2022-09-29")
      mineVillagesPayment.desc = "SML payment first batch"
      mineVillagesPayment.batch = 1
      mineVillagesPayment.amount = item.amount.trim()
      mineVillagesPayment.accountName = item.accountName.trim()
      mineVillagesPayment.accountNumber = item.accountNumber.trim()
      mineVillagesPayment.bank = item.bank.trim()
      mineVillagesPayment.status = "Approved"
      mineVillagesPayment.paymentType = "sml"

      await mineVillagesPayment.save()
    }

    res.status(200).json({
      success: true,
      message: "Mine villages sml payment collection created successfully"
    })
  } catch (error) {
    console.error("Error-create-minevillages-sml-payment-collection", error)
    return res.status(500).json({
      error: true,
      message: "Error creating mine villages sml payment collection"
    })
  }
}

// @desc    Creating mine villages lease payment collection
export const createMineVillagesLeasePaymentsCollection = async (req, res) => {
  try {
    const tempPayment = await TempPaymentModel.find().lean()

    if (!tempPayment) {
      return res.status(400).json({
        error: true,
        message: "No records found in temp payment collection"
      })
    }

    for (let item of tempPayment) {
      const mineVillagesPayment = new MineVillagesPaymentModel()
      const id = uuid() // Generate unique id for the payment

      mineVillagesPayment.paymentId = id
      mineVillagesPayment.regionId = await findRegionByVillage(
        item.villageId.trim()
      )
      mineVillagesPayment.villageId = await findVillage(item.villageId.trim())
      mineVillagesPayment.dwellingNo = item.dwellingNo
      mineVillagesPayment.householdNo = item.householdNo
      mineVillagesPayment.year = 2022
      mineVillagesPayment.date = new Date("2022-09-29")
      mineVillagesPayment.desc = "Land lease payment first batch"
      mineVillagesPayment.batch = 1
      mineVillagesPayment.amount = item.amount.trim()
      mineVillagesPayment.accountName = item.accountName.trim()
      mineVillagesPayment.accountNumber = item.accountNumber.trim()
      mineVillagesPayment.bank = item.bank.trim()
      mineVillagesPayment.status = "Approved"
      mineVillagesPayment.paymentType = "land-lease"

      await mineVillagesPayment.save()
    }

    res.status(200).json({
      success: true,
      message:
        "Mine villages land lease payment collection created successfully"
    })
  } catch (error) {
    console.error(
      "Error-create-minevillages-landlease-payment-collection",
      error
    )
    return res.status(500).json({
      error: true,
      message: "Error creating mine villages landlease payment collection"
    })
  }
}

// @desc    Update cmca payment type
export const updateCmcaPaymentType = async (req, res) => {
  try {
    await CmcaPaymentModel.updateMany({}, { paymentType: "cmca" })

    res.status(200).json({
      success: true,
      message: "Update cmca payment type is successful"
    })
  } catch (error) {
    console.error("Error-update-cmca-payment-type", error)
    return res.status(500).json({
      error: true,
      message: "Error updating cmca payment type"
    })
  }
}

// @desc  Update heduru clan account details
export const updateHeduruClanBankAccountDetails = async (req, res) => {
  try {
    const clans = await HeduruClanModel.find().lean()

    for (let clan of clans) {
      await HeduruClanBankAccountModel.findOneAndUpdate(
        { clanId: clan.clanId },
        {
          $set: {
            regionId: clan.regionId,
            villageId: clan.villageId
          }
        }
      )
    }

    res.status(200).json({
      success: true,
      message: "Heduru clan bank accounts updated successfully"
    })
  } catch (error) {
    console.error("Error updating heduru clan bank account details", error)
    return res.status(500).json({
      error: true,
      message: "Error updating heduru clan bank account details"
    })
  }
}
