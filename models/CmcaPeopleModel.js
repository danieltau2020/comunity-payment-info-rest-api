import mongoose from "mongoose"

const CmcaPeopleSchema = new mongoose.Schema(
  {
    personId: { type: String },
    regionId: { type: Number },
    villageId: { type: Number },
    dwellingNo: { type: Number },
    householdNo: { type: Number },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    sex: { type: String },
    relationship: { type: String },
    ageGroup: { type: String },
    dob: { type: String, trim: true }
  },
  {
    timestamps: true
  }
)

CmcaPeopleSchema.method("toJSON", function () {
  const { _v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const CmcaPeopleModel = mongoose.model("CmcaPeople", CmcaPeopleSchema)

export default CmcaPeopleModel
