require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const buildingRoutes = require('./src/routes/building-routes')
const roomRoutes = require('./src/routes/room-routes')
const majoringRoutes = require('./src/routes/majoring-routes')
const studyProgramRoutes = require('./src/routes/study-program-routes')
const semesterRoutes = require('./src/routes/semester-routes')
const batchRoutes = require('./src/routes/batch-routes')
const lecturerRoutes = require('./src/routes/lecturer-account-routes')
const coursesRoutes = require('./src/routes/courses-routes')
const classScheduleRoutes = require('./src/routes/class-schedule-routes')
const classRoutes = require('./src/routes/class-routes')
const lecturesRoutes = require('./src/routes/lectures-routes')
const studentAccountRoutes = require('./src/routes/student-account-routes')
const adminAccountRoutes = require('./src/routes/admin-account-routes')
const studentStatusRoutes = require('./src/routes/student-status-routes')
const presenceRoutes = require('./src/routes/presence-routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/buildings', buildingRoutes)
app.use('/rooms', roomRoutes)
app.use('/majorings', majoringRoutes)
app.use('/studyPrograms', studyProgramRoutes)
app.use('/semesters', semesterRoutes)
app.use('/batchs', batchRoutes)
app.use('/lecturerAccounts', lecturerRoutes)
app.use('/courses', coursesRoutes)
app.use('/classSchedules', classScheduleRoutes)
app.use('/classLectures', classRoutes)
app.use('/lectures', lecturesRoutes)
app.use('/studentAccounts', studentAccountRoutes)
app.use('/adminAccounts', adminAccountRoutes)
app.use('/studentStatus', studentStatusRoutes)
app.use('/presence', presenceRoutes)

const start = () => {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server is running at ${process.env.APP_HOST} on port ${process.env.APP_PORT}`)
  })
}

start()