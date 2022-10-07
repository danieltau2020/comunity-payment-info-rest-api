import mongoose from "mongoose"

const TempPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String },
    regionId: { type: String, trime: true },
    villageId: { type: String, trim: true },
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
    status: { type: String, trim: true }
  },
  {
    timestamps: true
  }
)

const TempPaymentModel = mongoose.model("TempPayment", TempPaymentSchema)

export default TempPaymentModel
