const Router = require('express').Router
const r = Router()
const vcService = require('../service/value-courses-service')

r.get('/', vcService.findAll)
r.get('/npm/:npm', vcService.findById)
r.get('/npm/:npm/courses/:courses', vcService.findByCourses)
r.get('/npm/:npm/ips/:semester', vcService.IPS)
r.get('/npm/:npm/ipk', vcService.IPK)
r.post('/add', vcService.insert)
r.put('/update', vcService.update)
r.delete('/delete', vcService.destroy)

module.exports = r