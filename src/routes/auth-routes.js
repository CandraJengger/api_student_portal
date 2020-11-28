const Router = require('express').Router
const r = Router()
const middleware = require('../middleware/middleware')
const authService = require('../service/auth-service')

r.post('/admin/login', authService.loginAdmin)
r.post('/student/login', authService.loginStudent)
r.post('/lecturer/login', authService.loginLecturer)
r.get('/admin/logout', middleware.authenticate, authService.logout)
r.get('/student/logout', middleware.authenticate, authService.logout)
r.get('/lecturer/logout', middleware.authenticate, authService.logout)

module.exports = r