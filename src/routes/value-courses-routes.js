const Router = require('express').Router
const r = Router()
const vcService = require('../service/value-courses-service')

r.get('/', vcService.findAll)
r.get('/:npm', vcService.findById)
r.post('/add', vcService.insert)
r.put('/update', vcService.update)
r.delete('/delete', vcService.destroy)

module.exports = r