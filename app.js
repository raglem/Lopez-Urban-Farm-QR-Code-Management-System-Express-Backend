import dotenv from 'dotenv'
import express from 'express'

import connectDB from './config/connectDB.js'
import userRouter from './routes/user.routes.js'

dotenv.config()

const app = express()
const port = 3000

app.use(express.json())
app.use('/users', userRouter)

app.listen(port, () => {
  connectDB()
  console.log(`Server listening on port ${port}`)
})
