// const jwt = require('jsonwebtoken')

require('dotenv').config()

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' })
  }

  const token = authHeader.split(' ')[1]

  if (token !== 'test-local') {
    return res.status(401).json({ message: 'Unauthorized, invalid token' })
  }

  try {
    // Verify the token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to the request
    // req.user = decoded

    next()
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized, invalid token' })
  }
}

module.exports = authMiddleware
