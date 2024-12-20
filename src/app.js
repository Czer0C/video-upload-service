const express = require('express')
const uploadRoutes = require('./routes/uploadRoutes')
const downloadRoutes = require('./routes/downloadRoutes')
const getRoutes = require('./routes/getRoutes')
const cors = require('cors')

require('dotenv').config()

const app = express()

// Enable CORS
app.use(cors())

// Middleware
app.use(express.json())

// Routes
app.use('/videos', getRoutes)
app.use('/videos/upload', uploadRoutes)
app.use('/videos/download', downloadRoutes)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
