const config = require ('./utils/config.js')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogsRouter.js')
const mongoose = require ('mongoose')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})