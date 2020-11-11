const Router = require('express').Router
const r = Router()
const roomController = require('../controllers/room-controller')

r.get('/', roomController.getAll)

module.exports = r