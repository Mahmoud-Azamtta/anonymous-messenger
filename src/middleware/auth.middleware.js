import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ message: "Authorization is required" });
  }

  if (!authorization.startsWith(process.env.BEARERKEY)) {
    return res.status(401).json({ message: "Invalid authorization" });
  }

  const token = authorization.split(process.env.BEARERKEY)[1];
  const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE);
  if (!decoded.id) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await userModel.findById(decoded.id).select("_id");
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  req.user = user;
  next();
};

export default auth;
