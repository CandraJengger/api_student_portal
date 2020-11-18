const Router = require('express').Router
const r = Router()
const lecturesService = require('../service/lectures-service')

r.get('/', lecturesService.findAll)
r.get('/:id', lecturesService.findById)
r.post('/add', lecturesService.insert)
r.put('/update', lecturesService.update)
r.delete('/delete', lecturesService.destroy)

module.exports = r