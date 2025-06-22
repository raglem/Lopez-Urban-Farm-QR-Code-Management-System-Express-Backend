import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'

import connectDB from './config/connectDB.js'
import userRouter from './routes/user.routes.js'
import plantRouter from './routes/plant.routes.js'
import Plant from './models/plant.models.js'

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/plants', plantRouter)

app.get('/', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API for the Lopez Urban Farm Evergreen Project',
  })
})

app.listen(port, async () => {
  await connectDB()
  console.log(`Server listening on port ${port}`)
})
