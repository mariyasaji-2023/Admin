
const { sendLoginEmail } = require('../sevices/nodemailer');
const Admin = require('../models/adminModel')
const Company = require('../models/companyModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists (admin or user)
    const user = await Admin.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Send response with token and role
    const token = jwt.sign({ adminId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });

    // Send email upon successful login
    const subject = 'Login Successful';
    const text = `Dear ${user.role}, you have successfully logged in with your account: ${email}.`;
    sendLoginEmail(email, subject, text);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const dashboard = async (req, res) => {
  try {
    // Extract the token from the request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token and extract the user info (adminId and role)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database by the adminId from the token
    const user = await Admin.findById(decodedToken.adminId);


    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send the dashboard message with the user's name
    res.json({
      data: {
        message: `Welcome to the Dashboard, ${user.name}!`,
        isAdmin: user.role === 'admin' ? 'yes' : 'no',
        username: user.name || 'No name provided'
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addCompany = async (req, res) => {
  const {
    companyName,
    registrationNo,
    gstNo,
    companyId,
    contactNo,
    location,
    representative
  } = req.body
  try {
    const newCompany = new Company({
      companyName,
      registrationNo,
      gstNo,
      companyId,
      contactNo,
      location,
      representative,
    })
    const savedCompany = await newCompany.save()
    res.status(201).json({
      data: {
        message: 'Company details added successfully',
        company: savedCompany
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { login, dashboard, addCompany };
