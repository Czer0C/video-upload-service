const express = require('express')
const bucket = require('../config/gcs')

const router = express.Router()
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const [, , listFiles] = await bucket.getFiles()

  res.status(200).json(listFiles.items)
})

router.get('/:fileName', async (req, res) => {
  const { fileName } = req.params

  try {
    const fileInfo = await bucket.file(fileName).getMetadata()

    res.status(200).json(fileInfo)
  } catch (error) {
    res.status(error.code).json({ message: error.message })
  }
})

module.exports = router
