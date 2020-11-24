const Router = require('express').Router
const r = Router()
const presenceService = require('../service/presence-service')

r.get('/', presenceService.findAll)
r.get('/:presence', presenceService.findById)
r.get('/npm/:npm', presenceService.findByNPM)
r.get('/npm/:npm/semester/:semester', presenceService.findBySemester)
r.get('/npm/:npm/semester/:semester/total', presenceService.getTotalPrecenceBySemester)
r.get('/npm/:npm/semester/:semester/week/:week', presenceService.findByWeek)
r.post('/add', presenceService.insert)
r.put('/update', presenceService.update)
r.delete('/delete', presenceService.destroy)

module.exports = r