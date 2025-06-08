const jwt = require("jsonwebtoken")

 const generateToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: "365d" })
}

module.exports = generateToken