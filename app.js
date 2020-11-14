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
const lecturerRoutes = require('./routes/lecturer-account-routes')
const coursesRoutes = require('./routes/courses-routes')
const classScheduleRoutes = require('./routes/class-schedule-routes')
const classRoutes = require('./routes/class-routes')
const lecturesRoutes = require('./routes/lectures-routes')
const studentAccountRoutes = require('./routes/student-account-routes')
const adminAccountRoutes = require('./routes/admin-account-routes')
const studentStatusRoutes = require('./routes/student-status-routes')

const app = express()

app.use(helmet())
app.use(bodyParser.json({ type: 'application/json' }))

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

const start = () => {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server is running at ${process.env.APP_HOST} on port ${process.env.APP_PORT}`)
  })
}

start()