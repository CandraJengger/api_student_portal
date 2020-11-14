const Router = require('express').Router
const r = Router()
const lecturerService = require('../service/lecturer-account-service')

r.get('/', lecturerService.findAll)
r.post('/', lecturerService.findById)
r.post('/add', lecturerService.insert)
r.put('/update', lecturerService.update)
r.delete('/delete', lecturerService.destroy)

module.exports = r