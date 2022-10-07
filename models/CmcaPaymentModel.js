import mongoose from "mongoose"

const CmcaPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String },
    regionId: { type: Number },
    villageId: { type: Number },
    dwellingNo: { type: Number },
    householdNo: { type: Number },
    year: { type: Number },
    date: { type: Date },
    desc: { type: String, trim: true },
    batch: { type: Number },
    perCapita: { type: String, trim: true },
    amount: { type: String, trim: true },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bank: { type: String, trime: true },
    status: { type: String, trim: true },
    paymentType: { type: String, trim: true }
  },
  {
    timestamps: true
  }
)

const CmcaPaymentModel = mongoose.model("CmcaPayment", CmcaPaymentSchema)

export default CmcaPaymentModel
