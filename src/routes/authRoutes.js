const express = require('express')
const router = express.Router()
const { verifyAdmin, verifyCompany, logout } = require('../middlewares/authMiddleware')
const { login, addCompany,updateCompanyEmail } = require('../controllers/authControllers')


router.post('/login', login)
router.get('/admin-dashboard', verifyAdmin, (req, res) => {
  res.json({ message: `Welcome to the Admin Dashboard!` });
});

// Company dashboard route (protected by verifyCompany middleware)
router.get('/company-dashboard', verifyCompany);
router.post('/addcompany', verifyAdmin, addCompany)
router.put('/company/update-email', updateCompanyEmail); 
router.post('/logout', logout)

module.exports = router
