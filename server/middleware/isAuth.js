import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    console.log("this is working");
    if (!token) {
      return res.status(400).json({ message: "token not found!" });
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "User doesn't have valid token!" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (err) {
    return res.status(500).json({ message: `isAuth error : ${err}` });
  }
};
export default isAuth;
