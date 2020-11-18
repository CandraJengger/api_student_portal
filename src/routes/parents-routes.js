const Router = require('express').Router
const r = Router()
const parentsService = require('../service/parents-service')

r.get('/', parentsService.findAll)
r.get('/:npm', parentsService.findById)
r.post('/add', parentsService.insert)
r.put('/update', parentsService.update)
r.delete('/delete', parentsService.destroy)

module.exports = r