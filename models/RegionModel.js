import mongoose from "mongoose"

const RegionSchema = new mongoose.Schema(
  {
    regionId: { type: Number },
    regionName: { type: String, trim: true }
  },
  { timestamps: true }
)

const RegionModel = mongoose.model("Region", RegionSchema)

export default RegionModel
