import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"
import dbRoutes from "./routes/dbRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"
import employeesRoutes from "./routes/employeesRoutes.js"
import cmcaRoutes from "./routes/cmcaRoutes.js"
import mineVillagesRoutes from "./routes/mineVillagesRoutes.js"

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    app.listen(process.env.PORT || 5000, () => {
      console.log("Db connection success")
      console.log(
        `Community & payments info api running on port ${process.env.PORT}`
      )
    })
  )
  .catch((err) => {
    console.log("Mongo connection error", err)
  })

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ),
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )
  next()
})

// app.use("/api/db", dbRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/employees", employeesRoutes)
app.use("/api/cmca", cmcaRoutes)
app.use("/api/minevillages", mineVillagesRoutes)

app.get("/test", (req, res) => {
  return res.send("Community & payments info server is up and running...")
})

app.use(notFound)
app.use(errorHandler)
