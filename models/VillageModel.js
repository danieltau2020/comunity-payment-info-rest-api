import mongoose from "mongoose"

const VillageSchema = new mongoose.Schema(
  {
    villageId: { type: Number },
    villageName: { type: String, trim: true },
    regionId: { type: Number }
  },
  { timestamps: true }
)

VillageSchema.statics.findOneByName = async function (villageName) {
  try {
    const village = await this.findOne({ villageName: villageName }).lean()
    return village
  } catch (error) {
    new Error(error)
  }
}

const VillageModel = mongoose.model("Village", VillageSchema)

export default VillageModel
