import mongoose from "mongoose"

const BankAccountsSchema = new mongoose.Schema(
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

const BankAccountsModel = mongoose.model("BankAccounts", BankAccountsSchema)

export default BankAccountsModel
