const express = require('express')
const axios = require('axios')
const multer = require('multer')
const bucket = require('../config/gcs')
const fs = require('fs')

const router = express.Router()
const auth = require('../middleware/auth')
const path = require('path')

// Multer configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileName = req.file.originalname

    const outputDir = `../${path.join('processing', fileName)}`

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    //! store temporary file for processing service
    const inputPath = path.join(outputDir, fileName)

    const processingId = getProcessingId()

    try {
      await fs.writeFileSync(inputPath, req.file.buffer)

      res.status(200).json({
        message: 'Processing file, you will be notified when it is done',
        outputDir,
        processingId,
      })

      const processingUrl = `http://localhost:5001/processing?filePath=${inputPath}&fileName=${fileName}&taskId=${processingId}`

      axios.get(processingUrl)
    } catch (error) {
      res.status(500).json({ error: err.message })
    }

    // const blob = bucket.file(req.file.originalname)

    // const blobStream = blob.createWriteStream({
    //   resumable: false,
    //   metadata: {
    //     contentType: req.file.mimetype,
    //   },
    // })

    // blobStream.on('error', (err) =>
    //   res.status(500).json({ error: err.message })
    // )

    // blobStream.on('finish', () => {
    //   const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    //   res
    //     .status(200)
    //     .json({ message: 'File uploaded successfully', url: publicUrl })
    // })

    // blobStream.end(req.file.buffer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//TODO: service to get processing id
function getProcessingId() {
  return Math.floor(Math.random() * 1000)
}

module.exports = router
