import UserModel from "../modals/User.js";
import jwt from "jsonwebtoken";

const create_user = async (req, res) => {
    const { firstName,  email, password} = req.body;
  
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(403).json({
        error: "this email is already in use",
      });
    }
    const user = await UserModel.create({
      firstName,
     password,
      email,
     
    });
    res.status(200).json({ success: true, message: "Account created!!", user });
  };
  
  const signIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }
  
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        return res.status(403).json({
          error: "Email/Password does not match!",
        });
      }
  
      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        "secret",
        {
          expiresIn: "1h",
        }
      );
  
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
        },
        token,
        message: "User login successful",
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  };
  const getUserData = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({
        error: "Internal server error",
        details: err.message,
      });
    }
  };

  export {create_user,signIn,getUserData}