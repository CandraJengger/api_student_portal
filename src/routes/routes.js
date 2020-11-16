const express = require('express')

const buildingRoutes = require('./building-routes')
const roomRoutes = require('./room-routes')
const majoringRoutes = require('./majoring-routes')
const studyProgramRoutes = require('./study-program-routes')
const semesterRoutes = require('./semester-routes')
const batchRoutes = require('./batch-routes')
const lecturerRoutes = require('./lecturer-account-routes')
const coursesRoutes = require('./courses-routes')
const classScheduleRoutes = require('./class-schedule-routes')
const classRoutes = require('./class-routes')
const lecturesRoutes = require('./lectures-routes')
const studentAccountRoutes = require('./student-account-routes')
const adminAccountRoutes = require('./admin-account-routes')
const studentStatusRoutes = require('./student-status-routes')
const presenceRoutes = require('./presence-routes')
const uktRoutes = require('./ukt-routes')
const reResgitrationRoutes = require('./re-registration-routes')
const annoncementRoutes = require('./announcement-routes')
const questionnaireRoutes = require('./questionnaire-routes')
const graduationRoutes = require('./graduation-routes')
const internshipRoutes = require('./internship-routes')
const skillsRoutes = require('./skills-routes')
const achievementRoutes = require('./achievement-routes')

const routes = app => {
  app.use('/uploads', express.static('../../public/uploads'))

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
  app.use('/ukt', uktRoutes)
  app.use('/reRegistrations', reResgitrationRoutes)
  app.use('/announcements', annoncementRoutes)
  app.use('/questionnaire', questionnaireRoutes)
  app.use('/graduations', graduationRoutes)
  app.use('/internship', internshipRoutes)
  app.use('/skills', skillsRoutes)
  app.use('/achievement', achievementRoutes)
}

module.exports = routes