const Router = require('express').Router
const r = Router()
const ilService = require('../service/international-language-service')

r.get('/', ilService.findAll)
r.get('/:npm', ilService.findById)
r.post('/add', ilService.insert)
r.put('/update', ilService.update)
r.delete('/delete', ilService.destroy)

module.exports = r