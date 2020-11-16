const Router = require('express').Router
const r = Router()
const graduationService = require('../service/graduation-service')

r.get('/', graduationService.findAll)
r.post('/', graduationService.findById)
r.post('/add', graduationService.insert)
r.put('/update', graduationService.update)
r.delete('/delete', graduationService.destroy)

module.exports = r