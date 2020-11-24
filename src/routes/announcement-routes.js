const Router = require('express').Router
const r = Router()
const announcementService = require('../service/announcement-service')

r.get('/', announcementService.findAll)
r.get('/:id', announcementService.findById)
r.get('/category/:category', announcementService.findByCategory)
r.post('/add', announcementService.insert)
r.put('/update', announcementService.update)
r.delete('/delete', announcementService.destroy)

module.exports = r