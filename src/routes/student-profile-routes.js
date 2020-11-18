const Router = require('express').Router
const r = Router()
const spService = require('../service/student-profile-service')

r.get('/', spService.findAll)
r.get('/:npm', spService.findById)
r.post('/add', spService.insert)
r.put('/update', spService.update)
r.delete('/delete', spService.destroy)
r.put('/uploadKTP', spService.uploadKTP)
r.put('/uploadProfile', spService.uploadProfileImg)

module.exports = r