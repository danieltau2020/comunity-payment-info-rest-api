import mongoose from "mongoose"

const HeduruClanVillageSchema = new mongoose.Schema(
  {
    villageId: { type: Number },
    villageName: { type: String, trim: true },
    regionId: { type: Number }
  },
  { timestamps: true }
)

const HeduruClanVillageModel = mongoose.model(
  "HeduruClanVillage",
  HeduruClanVillageSchema
)

export default HeduruClanVillageModel
