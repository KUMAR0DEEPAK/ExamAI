import { getToken } from "../utils/token.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ name, email });
    }

    let token = await getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
        
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: `googleSignUp ${err}` });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      
    });
    return res.status(200).json({ message: "Logout Successfully!" });
  } catch (err) {
    return res.status(500).json({ message: `logout error : ${err}` });
  }
};
