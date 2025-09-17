const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers?.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or malformed token",
      });
    }

    const splitToken = header.split(" ")[1];

    const token = jwt.verify(splitToken, process.env.SECRET_CODE);
    req.userInfo = token;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized user: ${error.message}`,
    });
  }
  
};

module.exports = authMiddleware;
