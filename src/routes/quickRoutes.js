const express = require('express')
const bucket = require('../config/gcs')
const jwt = require('jsonwebtoken')

const router = express.Router()
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'nothing',
  })

  // res.status(500).json({
  //   message: 'rip',
  // })
})

module.exports = router
