const Router = require('express').Router
const r = Router()
const roomService = require('../service/room-service')

r.get('/', roomService.findAll)

module.exports = r