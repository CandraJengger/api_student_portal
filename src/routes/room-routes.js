const Router = require('express').Router
const r = Router()
const roomService = require('../service/room-service')

r.get('/', roomService.findAll)
r.post('/', roomService.findById)
r.post('/add', roomService.insert)
r.put('/update', roomService.update)
r.delete('/delete', roomService.destroy)

module.exports = r