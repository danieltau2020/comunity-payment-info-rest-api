import mongoose from "mongoose"

const CmcaBankAccountsSchema = new mongoose.Schema(
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

CmcaBankAccountsSchema.method("toJSON", function () {
  const { _v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const CmcaBankAccountsModel = mongoose.model(
  "CmcaBankAccounts",
  CmcaBankAccountsSchema
)

export default CmcaBankAccountsModel
