const express = require('express')
const multer = require('multer')
const bucket = require('../config/gcs')

const router = express.Router()
const auth = require('../middleware/auth')

// Multer configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const blob = bucket.file(req.file.originalname)

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    })

    blobStream.on('error', (err) =>
      res.status(500).json({ error: err.message })
    )

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      res
        .status(200)
        .json({ message: 'File uploaded successfully', url: publicUrl })
    })

    blobStream.end(req.file.buffer)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
