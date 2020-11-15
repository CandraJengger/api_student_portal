const Router = require('express').Router
const r = Router()
const announcementService = require('../service/announcement-service')

r.get('/', announcementService.findAll)
r.post('/', announcementService.findById)
r.post('/add', announcementService.insert)
r.put('/update', announcementService.update)
r.delete('/delete', announcementService.destroy)

module.exports = r