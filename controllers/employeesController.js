import Joi from "joi"
import { v4 as uuid } from "uuid"
import EmployeesModel from "../models/EmpoyeesModel.js"

// Validate employees schema
const employeesSchema = Joi.object().keys({
  firstName: Joi.string().max(15).required(),
  lastName: Joi.string().max(15).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),
  position: Joi.string().max(20).required()
})

// Add employee
export const addEmployee = async (req, res) => {
  try {
    const result = employeesSchema.validate(req.body)

    if (result.error) {
      console.error(result.error.message)
      return res.json({
        error: true,
        status: 422,
        message: "Invalid details"
      })
    }

    // Check if employee exists
    const user = await EmployeesModel.findOne({ email: result.value.email })

    if (user) {
      return res.json({
        error: true,
        message: "Employee already exists"
      })
    }

    const id = uuid() // Generate unique id for the employee
    result.value.employeeId = id

    const newEmployee = new EmployeesModel(result.value)
    await newEmployee.save()

    return res.status(200).json({
      success: true,
      message: "Employee added successfully",
      firstName: result.value.firstName,
      lastName: result.value.lastName,
      email: result.value.email,
      position: result.value.position
    })
  } catch (error) {
    console.error("Add-employee-error", error)
    return res.status(500).json({
      error: true,
      message: "Cannot add employee"
    })
  }
}
