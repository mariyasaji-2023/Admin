const express = require('express')
const connectDB = require('./src/config/database')
const authRoutes = require('./src/routes/authRoutes')
require('dotenv').config()
const cors = require('cors'); 

const app = express()
console.log("Mongo URI:", process.env.MONGO_URI); // Debugging

connectDB()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.get('/', (req, res) => {
    res.send('Welcome to the Admin Login API');
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))