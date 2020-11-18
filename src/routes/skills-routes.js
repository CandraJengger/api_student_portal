const Router = require('express').Router
const r = Router()
const skillsService = require('../service/skills-service')

r.get('/', skillsService.findAll)
r.get('/:npm', skillsService.findById)
r.post('/add', skillsService.insert)
r.put('/update', skillsService.update)
r.delete('/delete', skillsService.destroy)

module.exports = r