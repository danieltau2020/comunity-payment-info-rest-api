import mongoose from "mongoose"

const EmployeesSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, requred: true },
  email: { type: String, unique: true, required: true },
  position: { type: String, required: true }
})

const EmployeesModel = mongoose.model("Employee", EmployeesSchema)

export default EmployeesModel
