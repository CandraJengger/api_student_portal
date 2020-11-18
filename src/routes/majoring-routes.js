const Router = require('express').Router
const r = Router()
const majoringService = require('../service/majoring-service')

r.get('/', majoringService.findAll)
r.get('/:id', majoringService.findById)
r.post('/add', majoringService.insert)
r.put('/update', majoringService.update)
r.delete('/delete', majoringService.destroy)

module.exports = r