const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  try {
    const { authentication } = req.headers;
    const token = authentication.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, userId } = decoded;
    req.username = username;
    req.userId = userId;
    next();
  } catch (error) {
    next("Authentication filed");
  }
};

module.exports = checkLogin;
