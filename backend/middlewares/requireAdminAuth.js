const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const requireAdminAuth = (allowedRoles = ['admin', 'superAdmin']) => {
  return async (req, res, next) => {
    const Authorization = req.headers['authorization'];
    if (!Authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = Authorization.split(' ')[1];


    try {
      const { _id } = jwt.verify(token, process.env.SECRET);

      const user = await Admin.findById(_id).select('_id role status');
      console.log("///////",user)
      
      if (!user) {
        return res.status(401).json({ error: 'Admin not found' });
      }

      if(user.status === "inactive") {
      
      return res.status(403).json({ error: 'Blocked: account is inactive' });
    }

      if (!allowedRoles.includes(user.role)) {
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

module.exports = requireAdminAuth;
