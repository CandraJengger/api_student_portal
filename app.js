require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const buildingRoutes = require('./routes/building-routes')
const roomRoutes = require('./routes/room-routes')

const app = express()

app.use(bodyParser.json({ type: 'application/json' }))
app.use('/buildings', buildingRoutes)
app.use('/rooms', roomRoutes)

const start = () => {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server is running at ${process.env.APP_HOST} on port ${process.env.APP_PORT}`)
  })
}

start()