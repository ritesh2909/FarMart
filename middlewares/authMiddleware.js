import User from "../models/User.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json("Unauthenticated!");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new Error("Token not found!");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.id);
    if (!user) {
      return res.status(401).json("User not found");
    }

    res.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json("JWT has expired");
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json("JWT is malformed");
    }
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export default verifyToken;
