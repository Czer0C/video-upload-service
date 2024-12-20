const express = require('express')
const bucket = require('../config/gcs')

const router = express.Router()
const auth = require('../middleware/auth')

router.get('/:downloadId', auth, async (req, res) => {
  const { downloadId } = req.params

  try {
    const [file] = await bucket.file(downloadId).download()

    res.status(200).send(file)
  } catch (error) {
    res.status(error.code).json({ message: error.message })
  }
})

module.exports = router
