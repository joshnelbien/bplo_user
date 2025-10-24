const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  console.log("Middleware triggered"); // 🔹 Add this line
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    console.log("User verified:", user); // 🔹 Logs decoded token
    next();
  });
}

module.exports = authenticateJWT;
