const express = require('express')
const router = express.Router()
const { verifyAdmin, verifyCompany, verifyCandidate,logout } = require('../middlewares/authMiddleware')
const { login, addCompany,updateCompanyEmail,addCandidate ,updateCandidateEmail} = require('../controllers/authControllers')


router.post('/login', login)
router.get('/admin-dashboard', verifyAdmin, (req, res) => {
  res.json({ message: `Welcome to the Admin Dashboard!` });
});

// Company dashboard route (protected by verifyCompany middleware)
router.get('/company-dashboard', verifyCompany);
router.get('/candidate-dashboard',verifyCandidate, (req, res) => {
  res.json({ message: `Welcome to the Candidate Dashboard !` });
});
router.post('/addcompany', verifyAdmin, addCompany)
router.put('/company/update-email', updateCompanyEmail); 
router.post('/addcandidate',verifyAdmin,addCandidate)
router.put('/candidate/update-email', updateCandidateEmail);
router.post('/logout', logout)

module.exports = router
