const Router = require('express').Router
const r = Router()
const studyProgramService = require('../service/study-program-service')

r.get('/', studyProgramService.findAll)
r.get('/:id', studyProgramService.findById)
r.post('/add', studyProgramService.insert)
r.put('/update', studyProgramService.update)
r.delete('/delete', studyProgramService.destroy)

module.exports = r