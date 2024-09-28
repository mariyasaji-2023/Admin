
const { sendLoginEmail } = require('../sevices/nodemailer');
const Admin = require('../models/adminModel')
const Company = require('../models/companyModel')
const Candidate = require('../models/candidateModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    let role;

    // Check if user is found in Admin collection
    if (user) {
      role = 'admin'; // Set role to admin
    } else {
      // Check if the user exists in the Company collection
      user = await Company.findOne({ email });
      if (user) {
        role = 'user'; // Set role to user (company)
      } else {
        // Check if the user exists in the Candidate collection
        user = await Candidate.findOne({ email });
        if (user) {
          role = 'candidate'; // Set role to candidate
        }
      }
    }

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Send response with token and role
    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const { sendLoginEmail } = require('../services/emailService'); // Import the email sending function

const addCompany = async (req, res) => {
  const {
    companyName,
    registrationNo,
    gstNo,
    companyId,
    contactNo,
    location,
    representative,
    email, // This is the company's email
    password,
  } = req.body;

  try {
    // Extract admin ID from the token (set by the `verifyAdmin` middleware)
    const adminId = req.user.adminId;

    // Define role as 'user'
    const role = 'user';

    // Create a new company with admin ID
    const newCompany = new Company({
      companyName,
      registrationNo,
      gstNo,
      companyId,
      contactNo,
      location,
      representative,
      email,
      password,
      admin: adminId, // Set the admin field to the logged-in admin's ID
      role,
    });

    const savedCompany = await newCompany.save();

    // Send an email notification to the company
    const subject = 'Company Registration Successful';
    const text = `Dear ${representative},\n\nYour company, ${companyName}, has been successfully registered in our system. Your email is ${email}.\n\nThank you!`;

    sendLoginEmail(email, subject, text); // Sending the email to the company's email

    // Return a success response
    res.status(201).json({
      data: {
        message: 'Company details added successfully',
        company: savedCompany,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addCandidate = async (req, res) => {
  const {
    candidateName,
    candidateId,
    contactNo,
    email, // Candidate's email
    password,
  } = req.body;

  try {
    // Extract admin ID from the token (set by the `verifyAdmin` middleware)
    const adminId = req.user.adminId;

    // Define role as 'candidate'
    const role = 'candidate';

    // Create a new candidate with admin ID
    const newCandidate = new Candidate({
      candidateName,
      candidateId,
      contactNo,
      email,
      password,
      admin: adminId, // Set the admin field to the logged-in admin's ID
      role,
    });

    const savedCandidate = await newCandidate.save();

    // Send an email notification to the candidate
    const subject = 'Candidate Registration Successful';
    const text = `Dear ${candidateName},\n\nYour registration as a candidate has been successfully completed. Your email is ${email}.\n\nThank you!`;

    sendLoginEmail(email, subject, text); // Sending the email to the candidate's email

    // Return a success response
    res.status(201).json({
      data: {
        message: 'Candidate details added successfully',
        candidate: savedCandidate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCompanyEmail = async (req, res) => {
  const { email, newEmail } = req.body; // Get current email and new email from request body

  try {
    // Find the company by the email and update it
    const updatedCompany = await Company.findOneAndUpdate(
      { email: email },  // Use email for finding the document
      { email: newEmail },  // Update with new email
      { new: true }  // Return the updated document
    );
         console.log(updatedCompany);
         
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Email updated successfully',
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateCandidateEmail = async (req, res) => {
  const { email, newEmail } = req.body; // Get current email and new email from request body

  try {
    // Find the candidate by the email and update it
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { email: email },  // Use current email to find the candidate
      { email: newEmail },  // Update with new email
      { new: true }  // Return the updated document
    );

    console.log(updatedCandidate);

    // If candidate not found, return a 404 error
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Return success response with updated candidate info
    res.status(200).json({
      message: 'Email updated successfully',
      candidate: updatedCandidate,
    });
  } catch (error) {
    // Return error response if any issues occur
    res.status(500).json({ message: error.message });
  }
};


module.exports = { login, addCompany,updateCompanyEmail,addCandidate ,updateCandidateEmail};
