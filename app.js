require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')

const app = express()

const initRoutes = require('./src/routes/routes')

app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(morgan('dev'))
app.use(fileUpload({
  limits: {
    fileSize: 3000000 // 3mb
  },
  abortOnLimit: true
}))

initRoutes(app)

const start = () => {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server is running at ${process.env.APP_HOST} on port ${process.env.APP_PORT}`)
  })
}

start()