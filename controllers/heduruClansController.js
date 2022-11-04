import RegionModel from "../models/RegionModel.js"
import HeduruClanVillageModel from "../models/HeduruClanVillageModel.js"

export const findAllHeduruClan = async (req, res) => {
  try {
    const clans = req.clans

    clans.sort((a, b) => {
      if (a.villageId > b.villageId) return 1
      if (a.villageId < b.villageId) return -1
      if (a.villageId === b.villageId) return 0
      if (a.clanName > b.clanName) return -1
      if (a.clanName < b.clanName) return 1
      if (a.clanName === b.clanName) return 0
    })

    return res.status(200).json({
      clans: clans,
      totalCount: req.totalCount
    })
  } catch (error) {
    console.error("Error get heduru clans", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get heduru clans",
      clans: [],
      totalCount: 0
    })
  }
}

export const findHeduruClan = async (req, res) => {
  try {
    const clan = req.clan

    const village = await HeduruClanVillageModel.findOne({
      villageId: Number(req.query.villageId)
    }).lean()

    const region = await RegionModel.findOne({
      regionId: Number(village.regionId)
    }).lean()

    return res.status(200).json({
      clan: clan,
      account: req.account,
      regionName: region.regionName,
      villageName: village.villageName
    })
  } catch (error) {
    console.error("Error get heduru clan", error)
    return res.status(500).json({
      error: true,
      message: "Error, can't get heduru clan",
      clan: [],
      totalCount: 0
    })
  }
}
