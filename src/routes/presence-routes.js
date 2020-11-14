const Router = require('express').Router
const r = Router()
const presenceService = require('../service/presence-service')

r.get('/', presenceService.findAll)
r.post('/', presenceService.findById)
r.post('/add', presenceService.insert)
r.put('/update', presenceService.update)
r.delete('/delete', presenceService.destroy)

module.exports = r