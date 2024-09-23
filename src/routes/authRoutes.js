const express = require('express')
const router = express.Router()
const { authenticate, logout } = require('../middlewares/authMiddleware')
const { login, dashboard, addCompany } = require('../controllers/authControllers')


router.post('/login', login)
router.get('/dashboard', authenticate, dashboard)
router.post('/addcompany', addCompany)
router.post('/logout', logout)

module.exports = router
