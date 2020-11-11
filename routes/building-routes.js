const Router = require('express').Router
const r = Router()
const buildingController = require('../controllers/building-controller')

r.get('/', buildingController.getAll)

module.exports = r