import mongoose from "mongoose"

const HeduruClanBankAccountSchema = new mongoose.Schema(
  {
    clanId: { type: Number },
    regionId: { type: Number },
    villageId: { type: Number },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bank: { type: String, trim: true }
  },
  { timestamps: true }
)

const HeduruClanBankAccountModel = mongoose.model(
  "HeduruClanBankAccount",
  HeduruClanBankAccountSchema
)

export default HeduruClanBankAccountModel
