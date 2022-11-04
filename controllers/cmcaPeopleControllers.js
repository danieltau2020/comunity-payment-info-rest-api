import CmcaPeopleModel from "../models/CmcaPeopleModel.js"
import RegionModel from "../models/RegionModel.js"
import VillageModel from "../models/VillageModel.js"

export const findAll = async (req, res) => {
  try {
    const people = req.people

    people.sort((a, b) => {
      if (a.villageId > b.villageId) return 1
      if (a.villageId < b.villageId) return -1
      if (a.villageId === b.villageId) return 0
      if (a.dwellingNo > b.dwellingNo) return 1
      if (a.dwellingNo < b.dwellingNo) return -1
      if (a.dwellingNo === b.dwellingNo) return 0
      if (a.householdNo > b.householdNo) return 1
      if (a.householdNo < b.householdNo) return -1
      if (a.householdNo === b.householdNo) return 0
      if (a.relationship === "Head" && b.relationship !== "Head") return -1
      if (a.relationship !== "Head" && b.relationship === "Head") return 1
      if (a.relationship === "Head" && b.relationship === "Head") return 0
    })

    return res.status(200).json({
      people: people,
      totalCount: req.totalCount
    })
  } catch (error) {
    console.error("Error-get-cmca-people", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get cmca people",
      people: [],
      totalCount: 0
    })
  }
}

export const findHousehold = async (req, res) => {
  try {
    const people = req.people

    people.sort((a, b) => {
      if (a.relationship === "Head" && b.relationship !== "Head") return -1
      if (a.relationship !== "Head" && b.relationship === "Head") return 1
      if (a.relationship === "Head" && b.relationship == "Head") return 0
    })

    const village = await VillageModel.findOne({
      villageId: Number(req.query.villageId)
    }).lean()

    const region = await RegionModel.findOne({
      regionId: Number(village.regionId)
    }).lean()

    const payment =
      req.paymentMineVillages?.length > 0
        ? [...req.paymentMineVillages, ...req.payment]
        : req.payment

    payment.sort((a, b) => {
      if (a.paymentType === "cmca" && b.paymentType !== "cmca") return -1
      if (a.paymentType !== "cmca" && b.paymentType === "cmca") return 1
      if (a.paymentType === "cmca" && b.paymentType === "cmca") return 0
      if (a.year > b.year) return 1
      if (a.year < b.year) return -1
      if (a.year === b.year) return 0
      if (a.batch > b.batch) return 1
      if (a.batch < b.batch) return -1
      if (a.batch === b.batch) return 0
    })

    return res.status(200).json({
      people: people,
      account: req.account,
      payment: payment,
      villageName: village.villageName,
      regionName: region.regionName
    })
  } catch (error) {
    console.error("Error-get-cmca-household", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get cmca household",
      people: [],
      totalCount: 0
    })
  }
}

export const findAllHouseholdHeads = async (req, res) => {
  try {
    const { regionId, villageId } = req.query

    let people = []

    if (regionId && villageId) {
      const tempPeople = await CmcatempPeopleModel.find({
        regionId: Number(regionId),
        villageId: Number(villageId),
        relationship: "Head"
      })
        .select([
          "regionId",
          "villageId",
          "dwellingNo",
          "householdNo",
          "firstName",
          "lastName",
          "sex",
          "relationship"
        ])
        .lean()

      for (let item of tempPeople) {
        const village = await VillageModel.findOne({
          villageId: Number(item.villageId)
        }).lean()

        const region = await RegionModel.findOne({
          regionId: Number(item.regionId)
        }).lean()

        people.push({
          ...item,
          regionName: region.regionName,
          villageName: village.villageName
        })
      }
      people.sort((a, b) => {
        if (a.villageId > b.villageId) return 1
        if (a.villageId < b.villageId) return -1
        if (a.villageId === b.villageId) return 0
        if (a.dwellingNo > b.dwellingNo) return 1
        if (a.dwellingNo < b.dwellingNo) return -1
        if (a.dwellingNo === b.dwellingNo) return 0
        if (a.householdNo > b.householdNo) return 1
        if (a.householdNo < b.householdNo) return -1
        if (a.householdNo === b.householdNo) return 0
      })

      return res.status(200).json([...people])
    }

    if (regionId) {
      const tempPeople = await CmcaPeopleModel.find({
        regionId: Number(regionId),
        relationship: "Head"
      })
        .select([
          "regionId",
          "villageId",
          "dwellingNo",
          "householdNo",
          "firstName",
          "lastName",
          "sex",
          "relationship"
        ])
        .lean()

      for (let item of tempPeople) {
        const village = await VillageModel.findOne({
          villageId: Number(item.villageId)
        }).lean()

        const region = await RegionModel.findOne({
          regionId: Number(item.regionId)
        }).lean()

        people.push({
          ...item,
          regionName: region.regionName,
          villageName: village.villageName
        })
      }

      people.sort((a, b) => {
        if (a.villageId > b.villageId) return 1
        if (a.villageId < b.villageId) return -1
        if (a.villageId === b.villageId) return 0
        if (a.dwellingNo > b.dwellingNo) return 1
        if (a.dwellingNo < b.dwellingNo) return -1
        if (a.dwellingNo === b.dwellingNo) return 0
        if (a.householdNo > b.householdNo) return 1
        if (a.householdNo < b.householdNo) return -1
        if (a.householdNo === b.householdNo) return 0
      })

      return res.status(200).json([...people])
    }

    return res.status(200).json({
      success: true,
      message: "No household heads found. Provide region or village.",
      people: []
    })
  } catch (error) {
    console.error("Error-get-cmca-household-heads", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get cmca household-heads",
      people: [],
      totalCount: 0
    })
  }
}
