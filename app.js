import dotenv from 'dotenv'
import express from 'express'

import connectDB from './config/connectDB.js'

dotenv.config()

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
