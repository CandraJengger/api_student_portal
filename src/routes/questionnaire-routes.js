const Router = require('express').Router
const r = Router()
const questionnaireService = require('../service/questionnaire-service')

r.get('/', questionnaireService.findAll)
r.post('/', questionnaireService.findById)
r.post('/add', questionnaireService.insert)
r.put('/update', questionnaireService.update)
r.delete('/delete', questionnaireService.destroy)

module.exports = r