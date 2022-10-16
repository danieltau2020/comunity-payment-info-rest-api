import mongoose from "mongoose"

const HeduruClanSchema = new mongoose.Schema(
  {
    clanId: { type: Number },
    clanName: { type: String, trim: true },
    population: { type: Number },
    regionId: { type: Number },
    villageId: { type: Number }
  },
  { timestamps: true }
)

const HeduruClanModel = mongoose.model("HeduruClan", HeduruClanSchema)

export default HeduruClanModel
