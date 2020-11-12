const Router = require('express').Router
const r = Router()
const buildingService = require('../service/building-service')

r.get('/', buildingService.findAll)
r.post('/', buildingService.findById)
r.post('/add', buildingService.insert)
r.put('/update', buildingService.update)
r.delete('/delete', buildingService.destroy)

module.exports = r