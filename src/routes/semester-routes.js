const Router = require('express').Router
const r = Router()
const semesterService = require('../service/semester-service')

r.get('/', semesterService.findAll)
r.get('/:id', semesterService.findById)
r.post('/add', semesterService.insert)
r.put('/update', semesterService.update)
r.delete('/delete', semesterService.destroy)

module.exports = r