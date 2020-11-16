const Router = require('express').Router
const r = Router()
const reRegistrationService = require('../service/re-registration-service')

r.get('/', reRegistrationService.findAll)
r.post('/', reRegistrationService.findById)
r.post('/krs', reRegistrationService.findByNPM)
r.get('/krs/:name', reRegistrationService.download)
r.post('/add', reRegistrationService.insert)
r.put('/update', reRegistrationService.update)
r.delete('/delete', reRegistrationService.destroy)

module.exports = r