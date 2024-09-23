const express = require('express')
const connectDB = require('./src/config/database')
const authRoutes = require('./src/routes/authRoutes')
require('dotenv').config()

const app = express()
console.log("Mongo URI:", process.env.MONGO_URI); // Debugging

connectDB()

app.use(express.json())
app.use('/api/auth', authRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))