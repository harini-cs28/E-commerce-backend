const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  } 


  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).json({error: "Unauthorized",message: err.message});
  }
};

module.exports = auth;
