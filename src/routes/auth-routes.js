const Router = require('express').Router
const r = Router()
const middleware = require('../middleware/middleware')
const authService = require('../service/auth-service')

r.post('/admin/login', authService.loginAdmin)
r.get('/admin/logout', middleware.authenticate, authService.logout)
r.post('/student/login', authService.loginStudent)

module.exports = r