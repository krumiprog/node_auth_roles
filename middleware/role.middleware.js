const jwt = require('jsonwebtoken');

module.exports = roles => {
  return async (req, res, next) => {
    if (req.method === 'OPTIONS') next();

    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token)
        return res.status(403).json({ message: 'User is not authenticated' });

      const { roles: userRoles } = await jwt.verify(token, process.env.SECRET);

      let hasRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) hasRole = true;
      });

      if (!hasRole) return res.status(403).json({ message: 'Access denied' });
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};
