const Router = require('express').Router
const r = Router()
const reRegistrationService = require('../service/re-registration-service')

r.get('/', reRegistrationService.findAll)
r.post('/', reRegistrationService.findById)
r.get('/krs/:npm', reRegistrationService.findByNPM)
r.get('/krs/file/:name', reRegistrationService.download)
r.post('/add', reRegistrationService.insert)
r.put('/update', reRegistrationService.update)
r.delete('/delete', reRegistrationService.destroy)

module.exports = r