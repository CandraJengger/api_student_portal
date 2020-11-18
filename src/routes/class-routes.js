const Router = require('express').Router
const r = Router()
const classService = require('../service/class-service')

r.get('/', classService.findAll)
r.get('/:id', classService.findById)
r.post('/add', classService.insert)
r.put('/update', classService.update)
r.delete('/delete', classService.destroy)

module.exports = r