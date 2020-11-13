const Router = require('express').Router
const r = Router()
const adminAccountService = require('../service/admin-account-service')

r.get('/', adminAccountService.findAll)
r.post('/', adminAccountService.findById)
r.post('/add', adminAccountService.insert)
r.put('/update', adminAccountService.update)
r.delete('/delete', adminAccountService.destroy)

module.exports = r