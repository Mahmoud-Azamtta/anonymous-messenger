import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";

export const profile = async (req, res) => {
  const userId = req.user._id;
  const user = await userModel.findOne(userId).select("username email");
  if (!user) {
    return res.status(409).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "success", user });
};

export const updatePassword = async (req, res) => {
  const id = req.user._id;
  const { email, newPassword } = req.body;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(500).json({ message: "Internal server error" });
  }

  if (user.email !== email) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const hash = await bcrypt.hash(newPassword, Number(process.env.SALTROUNT));
  const newUser = await userModel.findOneAndUpdate(
    { email },
    { password: hash },
  );
  if (!newUser) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ message: "Password updated successfuly" });
};
