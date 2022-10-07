import mongoose from "mongoose"

const TempPeopleSchema = new mongoose.Schema(
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

const TempPeopleModel = mongoose.model("TempPeople", TempPeopleSchema)

export default TempPeopleModel
