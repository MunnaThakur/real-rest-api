const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  const token = req.cookies.moon;
  if (token) {
    jwt.verify(token, "test", (err, decodedData) => {
      if (err) {
        res.json({ message: "error occured" });
      } else {
        next();
      }
    });
  } else {
    res.json({ message: "unauthorised" });
  }
};

module.exports = protectRoute;

