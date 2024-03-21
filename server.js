import express from "express"
import cors from "cors"
import "./dotenvConfig.js"
import { recordRoutes } from "./routes/record.js"
import { connectToServer } from "./db/conn.js"
import { globalErrorHandler } from "./middleware/errorMiddleware.js"
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static("client/dist"))
app.use(express.json())
app.use(recordRoutes)
app.use(globalErrorHandler)
const server = app.listen(0, () => {
  const port = server.address().port
  connectToServer(function (err) {
    if (err) console.error(err)
  })
  console.log(`Server is running: http://localhost:${port}`)
})