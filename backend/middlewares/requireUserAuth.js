const jwt = require('jsonwebtoken')
const User = require('../models/patient')

const requirePatientAuth = async (req, res, next) => {
  const Authorization = req.headers['authorization'];
  if (!Authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = Authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.user = await User.findById(_id).select('_id status')
    if (!req.user) {
      return res.status(401).json({ error: 'Patient not found' })
    }

    console.log("********",req.user)

    if (req.user.status === "inactive") {
      return res.status(403).json({ error: 'Blocked: account is inactive' })
    }
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = requirePatientAuth