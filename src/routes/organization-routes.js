const Router = require('express').Router
const r = Router()
const orgService = require('../service/organization-service')

r.get('/', orgService.findAll)
r.get('/:npm', orgService.findByNameOrg)
r.post('/add', orgService.insert)
r.put('/update', orgService.update)
r.delete('/delete', orgService.destroy)

module.exports = r