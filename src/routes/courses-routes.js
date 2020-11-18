const Router = require('express').Router
const r = Router()
const coursesService = require('../service/courses-service')

r.get('/', coursesService.findAll)
r.get('/:id', coursesService.findById)
r.post('/add', coursesService.insert)
r.put('/update', coursesService.update)
r.delete('/delete', coursesService.destroy)

module.exports = r