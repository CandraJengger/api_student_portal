const Router = require('express').Router
const r = Router()
const achievementService = require('../service/achievement-service')

r.get('/', achievementService.findAll)
r.post('/', achievementService.findById)
r.post('/add', achievementService.insert)
r.put('/update', achievementService.update)
r.delete('/delete', achievementService.destroy)

module.exports = r