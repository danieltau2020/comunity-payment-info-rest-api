import mongoose from "mongoose"

const MineVillagesBankAccountsSchema = new mongoose.Schema(
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

MineVillagesBankAccountsSchema.method("toJSON", function () {
  const { _v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const MineVillagesBankAccountsModel = mongoose.model(
  "MineVillagesBankAccounts",
  MineVillagesBankAccountsSchema
)

export default MineVillagesBankAccountsModel
