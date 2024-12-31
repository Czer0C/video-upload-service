


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


router.post('/', auth, async (req, res) => {
  const { fileName } = req.query

  if (!fileName) {
    return res.status(400).send('Missing filename')
  }

  const file = bucket.file(fileName)

 // Set response headers
 res.setHeader('Content-Type', 'application/octet-stream');
 res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

 // Pipe the file from GCS to the HTTP response
 file.createReadStream()
     .on('error', (err) => {
         console.error('Error streaming file:', err);
         res.status(500).send('Error streaming file');
     })
     .pipe(res)
     .on('finish', () => {
         console.log('File streamed successfully.');
     });



})

module.exports = router