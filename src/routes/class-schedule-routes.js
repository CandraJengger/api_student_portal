const Router = require('express').Router
const r = Router()
const classScheduleService = require('../service/class-schedule-service')

r.get('/', classScheduleService.findAll)
r.post('/', classScheduleService.findById)
r.post('/add', classScheduleService.insert)
r.put('/update', classScheduleService.update)
r.delete('/delete', classScheduleService.destroy)

module.exports = r