
const { sendLoginEmail } = require('../sevices/nodemailer');
const Admin = require('../models/adminModel')
const Company = require('../models/companyModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email })
    if (user) {
      role = 'admin'; // Set role to admin
    } else {
      // Check if the user exists in the Company collection
      user = await Company.findOne({ email });
      console.log(user, ']]]]]]]]]]]]]]]]');
    }


    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Send response with token and role
    const token = jwt.sign({ adminId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "dddddddddddddddd"); // This will show userId and role

    // // Send email upon successful login
    // const subject = 'Login Successful';
    // const text = `Dear ${user.role}, you have successfully logged in with your account: ${email}.`;
    // sendLoginEmail(email, subject, text);

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





module.exports = { login, addCompany,updateCompanyEmail };
