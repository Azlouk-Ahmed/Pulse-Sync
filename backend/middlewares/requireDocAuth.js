const jwt = require('jsonwebtoken')
const Doctor = require('../models/doctor')

const requireDocAuth = (allowedRoles = ['radiologue', 'prescripteur']) => {
  return async (req, res, next) => {
    const Authorization = req.headers['authorization'];
    if (!Authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = Authorization.split(' ')[1];

    console.log(token)

    try {
      const { _id } = jwt.verify(token, process.env.SECRET);
      console.log(_id)

      const user = await Doctor.findById(_id).select('_id specialization center status');
      
      if (!user) {
        return res.status(401).json({ error: 'Doctor not found' });
      }
      if(user.status === "inactive") {
      
      return res.status(403).json({ error: 'Blocked: account is inactive' });
    }

      if (!allowedRoles.includes(user.specialization)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      req.user = user;
      next();

    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  };
};

module.exports = requireDocAuth;
