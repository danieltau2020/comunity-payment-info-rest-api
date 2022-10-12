import mongoose from "mongoose"

const ResaClansSchema = new mongoose.Schema(
  {
    clanId: { type: Number },
    regionId: { type: Number },
    villageId: { type: Number },
    clanName: { type: String, trim: true },
    clanPopulation: { type: Number }
  },
  { timestamps: true }
)

const ResaClanModel = mongoose.model("ResaClan", ResaClansSchema)

export default ResaClanModel
