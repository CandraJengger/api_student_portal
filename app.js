require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')

const buildingRoutes = require('./routes/building-routes')
const roomRoutes = require('./routes/room-routes')
const majoringRoutes = require('./routes/majoring-routes')
const studyProgramRoutes = require('./routes/study-program-routes')
const semesterRoutes = require('./routes/semester-routes')
const batchRoutes = require('./routes/batch-routes')

const app = express()

app.use(helmet())
app.use(bodyParser.json({ type: 'application/json' }))

app.use('/buildings', buildingRoutes)
app.use('/rooms', roomRoutes)
app.use('/majorings', majoringRoutes)
app.use('/studyPrograms', studyProgramRoutes)
app.use('/semesters', semesterRoutes)
app.use('/batchs', batchRoutes)

const start = () => {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server is running at ${process.env.APP_HOST} on port ${process.env.APP_PORT}`)
  })
}

start()