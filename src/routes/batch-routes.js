const Router = require('express').Router
const r = Router()
const batchService = require('../service/batch-service')

r.get('/', batchService.findAll)
r.get('/:id', batchService.findById)
r.post('/add', batchService.insert)
r.put('/update', batchService.update)
r.delete('/delete', batchService.destroy)

module.exports = r