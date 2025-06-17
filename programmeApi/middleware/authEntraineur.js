const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token manquant.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient { id, role }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Accès réservé au rôle ${role}.` });
    }
    next();
  };
};
