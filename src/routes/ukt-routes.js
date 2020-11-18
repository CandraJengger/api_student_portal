const Router = require('express').Router
const r = Router()
const uktService = require('../service/ukt-service')

r.get('/', uktService.findAll)
r.get('/:npm', uktService.findById)
r.post('/add', uktService.insert)
r.put('/update', uktService.update)
r.delete('/delete', uktService.destroy)

module.exports = r