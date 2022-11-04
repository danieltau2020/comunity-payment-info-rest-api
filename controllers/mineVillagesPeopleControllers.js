import VillageModel from "../models/VillageModel.js"
import RegionModel from "../models/RegionModel.js"

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
    console.error("Error-get-minevillages-people", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get mine villages people",
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

    const payment = req.paymentMineVillages

    payment.sort((a, b) => {
      if (a.paymentType === "sml" && b.paymentType !== "sml") return -1
      if (a.paymentType !== "sml" && b.paymentType === "sml") return 1
      if (a.paymentType === "sml" && b.paymentType === "sml") return 0
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
    console.error("Error-get-minevillage-household", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get mine village household",
      people: [],
      totalCount: 0
    })
  }
}
