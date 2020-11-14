const Router = require('express').Router
const r = Router()
const studentAccountService = require('../service/student-account-service')

r.get('/', studentAccountService.findAll)
r.post('/', studentAccountService.findById)
r.post('/add', studentAccountService.insert)
r.put('/update', studentAccountService.update)
r.delete('/delete', studentAccountService.destroy)

module.exports = r