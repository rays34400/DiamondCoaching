const jwt = require('jsonwebtoken');

const authClient = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'client') return res.status(403).json({ message: 'Accès refusé' });
    req.client = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authClient;
