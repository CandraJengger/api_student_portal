const Router = require('express').Router
const r = Router()
const studentStatusService = require('../service/student-status-service')

r.get('/', studentStatusService.findAll)
r.get('/npm/:npm', studentStatusService.findByNPM)
r.post('/', studentStatusService.findById)
r.post('/add', studentStatusService.insert)
r.put('/update', studentStatusService.update)
r.delete('/delete', studentStatusService.destroy)

module.exports = r