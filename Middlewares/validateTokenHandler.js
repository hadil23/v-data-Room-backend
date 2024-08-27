const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader); // Debugging

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log('Token:', token); // Debugging

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT Error:', err); // Debugging
        return res.status(401).json({ message: "User is not authorized" });
      }

      req.user = decoded.user;
      next();
    });
  } else {
    return res.status(401).json({ message: "User is not authorized or token is missing" });
  }
};

module.exports = validateToken;
