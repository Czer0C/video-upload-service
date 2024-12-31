const express = require('express')
const bucket = require('../config/gcs')

const router = express.Router()
const auth = require('../middleware/auth')


router.get('/test', async (req, res) => {
  res.status(200).json({ message: 'Test route' })
})

router.get('/', async (req, res) => {
  const { fileName } = req.query

  if (fileName) {
    try {
      const fileInfo = await bucket.file(fileName).getMetadata()

      return res.status(200).json(fileInfo)
    } catch (error) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  const [, , listFiles] = await bucket.getFiles()

  const finalListFiles =
    typeof listFiles.items !== 'undefined' ? listFiles.items : []

  res.status(200).json(finalListFiles)
})

router.get('/download', async (req, res) => {
  const { fileName } = req.query

  if (!fileName) {
    return res.status(400).json({ message: 'File name is required' })
  }

  try {
    const file = bucket.file(fileName)

    const fileExists = await file.exists()

    if (!fileExists[0]) {
      return res.status(404).json({ message: 'File not found' })
    }

    const readStream = file.createReadStream()

    readStream.on('error', (err) => {
      res.status(500).json({ message: err.message })
    })


    readStream.pipe(res)
  } catch (error) {
    return res.status(error.code).json({ message: error.message })
  }
})

module.exports = router
