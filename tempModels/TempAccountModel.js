import mongoose from "mongoose"

const TempAccountSchema = new mongoose.Schema(
  {
    regionId: { type: Number },
    villageId: { type: Number },
    dwellingNo: { type: Number },
    householdNo: { type: Number },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bank: { type: String, trim: true }
  },
  { timestamps: true }
)

const TempAccountModel = mongoose.model("TempAccount", TempAccountSchema)

export default TempAccountModel
