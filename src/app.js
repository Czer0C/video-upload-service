const express = require('express')
const uploadRoutes = require('./routes/uploadRoutes')
const getRoutes = require('./routes/getRoutes')
const quickRoutes = require('./routes/quickRoutes')
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

app.use('/quick', quickRoutes)

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
