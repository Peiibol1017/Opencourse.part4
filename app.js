const config = require ('./utils/config.js')
const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogsRouter.js')
const usersRouter = require('./controllers/usersRouter.js')
const loginRouter = require('./controllers/loginRouter.js')
const middleware = require('./utils/middleware.js')
const logger = require('./utils/logger.js')
const mongoose = require ('mongoose')

const app = express()

logger.info('Connecting to MongoDB...')

mongoose
.connect(config.MONGODB_URI)
.then(() => {
  logger.info('Connected to MongoDB')
})
.catch((error) => {
  logger.error('Error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports=  app
