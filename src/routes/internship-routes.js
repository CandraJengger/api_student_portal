const Router = require('express').Router
const r = Router()
const internshipService = require('../service/internship-service')

r.get('/', internshipService.findAll)
r.post('/', internshipService.findById)
r.post('/add', internshipService.insert)
r.put('/update', internshipService.update)
r.delete('/delete', internshipService.destroy)

module.exports = r