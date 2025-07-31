import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'

import connectDB from './config/connectDB.js'
import userRouter from './routes/user.routes.js'
import plantRouter from './routes/plant.routes.js'
import quizRouter from './routes/quiz.routes.js'
import gardenRouter from './routes/garden.routes.js'

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/plants', plantRouter)
app.use('/quiz', quizRouter)
app.use('/gardens', gardenRouter)

app.get('/', async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the API for the Lopez Urban Farm Evergreen Project',
  })
})

const startServer = async () => {
  try {
      await connectDB()
      console.log('Connected to MongoDB')
      app.listen(port, () => {
          console.log(`Server is running at http://localhost:${port}`)
      })
  } catch (err) {
      console.error('Failed to connect to DB', err)
      process.exit(1)
  }
}

startServer()
